from nintendo.nex import backend, settings
from nintendo import nnas
import anyio
from asgiref.sync import async_to_sync

import logging
logging.basicConfig(level=logging.INFO)

@async_to_sync
async def check(
    DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
    REGION_ID, _COUNTRY_ID, _REGION_NAME,
    COUNTRY_NAME, LANGUAGE, USERNAME,
    PASSWORD, CERT, TITLE_ID,
    TITLE_VERSION, GAME_SERVER_ID, ACCESS_KEY,
    NEX_VERSION
):
    try:
        nas = nnas.NNASClient()
        nas.set_device(DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION, CERT)
        nas.set_title(TITLE_ID, TITLE_VERSION)
        nas.set_locale(REGION_ID, COUNTRY_NAME, LANGUAGE)

        access_token = await nas.login(USERNAME, PASSWORD)
        nex_token = await nas.get_nex_token(access_token.token, GAME_SERVER_ID)

        s = settings.default()
        s.configure(ACCESS_KEY, NEX_VERSION)
        async with backend.connect(s, nex_token.host, nex_token.port) as be:
            be.login(str(nex_token.pid), nex_token.password)
            return True
    except Exception as e:
        print(f"Server {hex(TITLE_ID)} down!")
        logging.exception(e)
        return False

def splatoon(
    DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
    REGION_ID, COUNTRY_ID, REGION_NAME,
    COUNTRY_NAME, LANGUAGE, USERNAME,
    PASSWORD, CERT
):
    return check(DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
                 REGION_ID, COUNTRY_ID, REGION_NAME,
                 COUNTRY_NAME, LANGUAGE, USERNAME,
                 PASSWORD, CERT, 0x0005000010162B00,
                 272, 0x10162B00, "6f599f81",
                 30500)

def mk8(
    DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
    REGION_ID, COUNTRY_ID, REGION_NAME,
    COUNTRY_NAME, LANGUAGE, USERNAME,
    PASSWORD, CERT
):
    return check(DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
                 REGION_ID, COUNTRY_ID, REGION_NAME,
                 COUNTRY_NAME, LANGUAGE, USERNAME,
                 PASSWORD, CERT, 0x000500001010EB00,
                 64, 0x1010EB00, "25dbf96a",
                 30504)

def smm(
    DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
    REGION_ID, COUNTRY_ID, REGION_NAME,
    COUNTRY_NAME, LANGUAGE, USERNAME,
    PASSWORD, CERT
):
    return check(DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
                 REGION_ID, COUNTRY_ID, REGION_NAME,
                 COUNTRY_NAME, LANGUAGE, USERNAME,
                 PASSWORD, CERT, 0x000500001018DB00,
                 64, 0x1018DB00, "9f2b4678",
                 30803)

def friends(
    DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
    REGION_ID, COUNTRY_ID, REGION_NAME,
    COUNTRY_NAME, LANGUAGE, USERNAME,
    PASSWORD, CERT
):
    return check(DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
                 REGION_ID, COUNTRY_ID, REGION_NAME,
                 COUNTRY_NAME, LANGUAGE, USERNAME,
                 PASSWORD, CERT, 0x0005000010001C00,
                 0, 0x3200, "ridfebb9",
                 20000)
