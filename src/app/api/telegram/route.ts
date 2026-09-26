import { NextResponse } from 'next/server';
import { Order } from '@/types';

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || '8828911014:AAG03_bcw8ty5fGw9Us9T6HW3T_q0lisUYM';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5303605348';

function formatTelegramMessage(order: Order): string {
  const itemsText = order.items
    .map((item, idx) => {
      const variantsText = item.selectedVariants
        ? ` (${Object.entries(item.selectedVariants)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')})`
        : '';
      const productUrl = item.productSlug
        ? `https://hykon.ge/product/${encodeURIComponent(item.productSlug)}`
        : `https://hykon.ge/product/${encodeURIComponent(item.productId)}`;

      return `${idx + 1}. <a href="${productUrl}"><b>${item.productTitle}</b></a>${variantsText}\n   ├ 🔗 <a href="${productUrl}">Ссылка на товар</a>\n   └ ${item.quantity} шт. × ${item.price} ₾ = <b>${item.price * item.quantity} ₾</b> (SKU: <code>${item.productSku}</code>)`;
    })
    .join('\n\n');

  const deliveryText =
    order.deliveryMethod === 'courier'
      ? `🚗 <b>Курьерская доставка</b>\n📍 <b>Адрес:</b> ${order.customer.city || 'Батуми'}, ${order.customer.address}`
      : `🏬 <b>Самовывоз из шоурума:</b> ${order.pickupLocation || 'Батуми, Грузия'}`;

  const paymentText =
    order.paymentMethod === 'card'
      ? '💳 Оплата картой онлайн'
      : order.paymentMethod === 'cash'
      ? '💵 Оплата курьеру при получении'
      : '🏛 Безналичный расчет (RS.GE / Инвойс)';

  const notesText = order.customer.notes ? `\n💬 <b>Комментарий:</b> ${order.customer.notes}` : '';

  return `🔥 <b>НОВЫЙ ЗАКАЗ #${order.orderNumber}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${order.customer.fullName}
📞 <b>Телефон:</b> <a href="tel:${order.customer.phone}">${order.customer.phone}</a>
✉️ <b>Email:</b> ${order.customer.email || 'Не указан'}

${deliveryText}
💰 <b>Оплата:</b> ${paymentText}${notesText}

📦 <b>СОСТАВ ЗАКАЗА:</b>
${itemsText}

━━━━━━━━━━━━━━━━━━
Сумма товаров: <b>${order.subtotal} ₾</b>
Доставка: <b>${order.shippingFee > 0 ? `${order.shippingFee} ₾` : 'Бесплатно'}</b>
${order.discount > 0 ? `Скидка: <b>-${order.discount} ₾</b>\n` : ''}ИТОГО К ОПЛАТЕ: <b>${order.total} ₾</b>
⏰ <i>${new Date(order.createdAt).toLocaleString('ru-RU', { timeZone: 'Asia/Tbilisi' })} (Батуми / Грузия)</i>`;
}

async function sendToTelegram(chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  return response.json();
}

export async function POST(req: Request) {
  try {
    const order: Order = await req.json();
    if (!order || !order.orderNumber) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const message = formatTelegramMessage(order);

    // Try primary chatId first
    let res = await sendToTelegram(TELEGRAM_CHAT_ID, message);

    // If chat not found and ID does not start with -100, try supergroup prefix -100
    if (!res.ok && !TELEGRAM_CHAT_ID.startsWith('-100')) {
      const supergroupId = '-100' + TELEGRAM_CHAT_ID.replace('-', '');
      const supergroupRes = await sendToTelegram(supergroupId, message);
      if (supergroupRes.ok) {
        res = supergroupRes;
      }
    }

    return NextResponse.json({ success: true, telegramResponse: res });
  } catch (error: any) {
    console.error('Failed to send Telegram notification:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
