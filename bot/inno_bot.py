import logging
import os
import asyncio

from aiogram import Bot, Dispatcher, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, FSInputFile, WebAppInfo
from dotenv import load_dotenv
import psycopg2
# Загрузка переменных окружения
load_dotenv()

logger = logging.getLogger(__name__)

bot = Bot(os.getenv("BOT_TOKEN"), default=DefaultBotProperties(
    parse_mode=ParseMode.HTML,
))

dp = Dispatcher(store=MemoryStorage())
start_router = Router()


@start_router.message(CommandStart())
async def hello(message):
    connection = psycopg2.connect(
        dbname=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        host=os.getenv("DATABASE_HOST"),
        port=os.getenv("DATABASE_PORT")
    )
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO exchange_user (tg_id, username, first_name, last_name) VALUES (%s, %s, %s, %s) "
        "ON CONFLICT (tg_id) DO NOTHING;",
        (message.chat.id, message.chat.username, message.chat.first_name, message.chat.last_name)
    )
    connection.commit()
    buttons = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Искать заказ 🔍", web_app=WebAppInfo(url="https://innofreelance.ru/exchange/orders")),
                          InlineKeyboardButton(text="Создать заказ 📢", web_app=WebAppInfo(url="https://innofreelance.ru/exchange/office"))]])

    await message.answer(text="""

👋 Добро пожаловать на <b>INNOFreelance</b>!

Мы рады приветствовать вас на платформе, где фрилансеры находят идеальные проекты, а заказчики — талантливых исполнителей. 

Что вы можете сделать здесь:

💼 <b>Заказчики</b>:
 - Опубликуйте проект и найдите лучших фрилансеров для его выполнения.
 - Получите предложения и выберите наиболее подходящего кандидата.
 - Легко управляйте своими проектами и общайтесь с исполнителями.

🧑‍💻 <b>Фрилансеры</b>:
 - Находите интересные проекты, соответствующие вашим навыкам.
 - Предлагайте свои услуги и зарабатывайте, работая над любимыми задачами.
 - Развивайте свою карьеру и получайте новые возможности.


Желаем вам успехов на INNOFreelance! ✨  

<b>Выберите, с чего хотите начать</b> 👇"""
                               , reply_markup=buttons)


dp.include_router(start_router)


async def main():
    logger.info("Starting bot and web server")

    # Отключаем вебхук, чтобы бот работал через polling
    await bot.delete_webhook(drop_pending_updates=True)
    logger.info("Телеграм бот запущен")
    # Параллельный запуск бота (polling) и веб-сервера
    await asyncio.gather(
        dp.start_polling(bot),
    )


if __name__ == '__main__':
    asyncio.run(main())
