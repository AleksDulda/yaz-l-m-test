# Reqres.in API Test Otomasyonu

Playwright + TypeScript ile Reqres.in **Demo API** üzerinde modüler API test projesi.

## Senaryo

| Adım | Endpoint | Doğrulama |
|------|----------|-----------|
| POST | `/api/users` | `201`, echo (`name`, `job`, `id`, `createdAt`), yanıt süresi < 800ms |
| GET | `/api/users/2` | `200`, fixture (`id: 2`, `first_name: Janet`), yanıt süresi < 800ms |

**Önemli:** Demo API POST verisini kalıcı kaydetmez. POST'tan dönen `id` GET'te kullanılmaz (404 riski). GET adımı sabit fixture ID (`2`) ile çalışır; iki adım birbirine bağlanmaz.

## API neyi test ediyor?

Bu proje [Reqres.in](https://reqres.in) sitesinin **kullanıcı (users) REST API**'sini test eder. Gerçek bir ürün backend'i değildir; test ve öğrenme için hazırlanmış sahte (mock) bir API'dir.

**Tek cümleyle:** Reqres kullanıcı API'sinin POST (create) ve GET (read) endpoint'lerinin doğru HTTP kodu, yanıt süresi ve JSON gövdesi döndürdüğünü doğrular.

İki HTTP isteği **birbirinden bağımsızdır** (chaining yok).

### 1) POST — Kullanıcı oluşturma simülasyonu

| | |
|---|---|
| **Endpoint** | `POST /api/users` |
| **Gönderilen body** | `{ "name": "...", "job": "QA Engineer" }` |
| **Beklenen status** | `201 Created` |
| **Beklenen süre** | < 800 ms |

**Testin doğruladıkları:**
- Status kodu `201` mi?
- Yanıt süresi 800 ms'den kısa mı?
- Dönen `name` ve `job`, gönderilen değerlerle aynı mı? (echo)
- `id` ve `createdAt` alanları dolu mu?

**Örnek API yanıtı:**

```json
{
  "name": "Jane Doe",
  "job": "QA Engineer",
  "id": "916",
  "createdAt": "2026-05-22T09:22:24.031Z"
}
```

> POST yanıtı kullanıcıyı **kalıcı kaydetmez**. API yalnızca "oluşturulmuş gibi" cevap verir; `id` her istekte farklı olabilir.

### 2) GET — Sabit demo kullanıcıyı okuma

| | |
|---|---|
| **Endpoint** | `GET /api/users/2` |
| **Beklenen status** | `200 OK` |
| **Beklenen süre** | < 800 ms |

**Testin doğruladıkları:**
- Status kodu `200` mi?
- Yanıt süresi 800 ms'den kısa mı?
- `data.id` = `2` mi?
- `data.first_name` = `"Janet"` mi?
- `data.email` `@reqres.in` ile bitiyor mu?

**Örnek API yanıtı:**

```json
{
  "data": {
    "id": 2,
    "email": "janet.weaver@reqres.in",
    "first_name": "Janet",
    "last_name": "Weaver",
    "avatar": "https://reqres.in/img/faces/2-image.jpg"
  }
}
```

> Bu kullanıcı **her zaman aynıdır**: Janet Weaver (`id: 2`). POST'tan dönen `id` ile ilişkisi yoktur.

### POST ve GET yanıtları neden farklı?

| | POST yanıtı | GET yanıtı |
|---|-------------|------------|
| **Amaç** | "Kullanıcı oluşturuldu" cevabı | Hazır demo kullanıcı verisi |
| **JSON şeması** | Düz obje: `name`, `job`, `id`, `createdAt` | `data` içinde: `email`, `first_name`, `last_name`, `avatar` |
| **Kalıcılık** | Yok (echo) | Sabit fixture (`id: 2`) |

POST'taki `id` (ör. `"916"`) ile GET'teki `id: 2` **aynı kullanıcı değildir**. Bu nedenle testler POST `id`'sini GET isteğinde kullanmaz.

### TypeScript tipleri (`src/models/user.types.ts`)

| Tip | Kullanım |
|-----|----------|
| `CreateUserRequest` | POST body: `name`, `job` |
| `CreateUserResponse` | POST yanıtı: `name`, `job`, `id`, `createdAt` |
| `GetUserResponse` | GET yanıtı: `{ data: FixtureUser }` |
| `FixtureUser` | `id`, `email`, `first_name`, `last_name`, `avatar` |

## Kurulum

```bash
cd yazılım-test
npm install
npm test   # API key yoksa yerel mock sunucu ile çalışır
```

**Canlı Reqres API** için (önerilen):

```bash
cp .env.example .env
# .env içinde REQRES_API_KEY=... (ücretsiz: https://app.reqres.in/api-keys)
npm test
```

> **Not:** Reqres `/api/*` endpoint'leri `x-api-key` gerektirir. Key yoksa proje otomatik olarak yerel mock sunucuya (`scripts/mock-reqres-server.mjs`) geçer; POST echo + GET fixture (id=2, Janet) davranışını simüle eder.

## Testleri çalıştırma

```bash
npm test
# veya sadece API testleri:
npm run test:api
```

HTML raporu:

```bash
npm run test:report
```

## Proje yapısı

```
src/
  config/environment.ts    # baseURL, maxResponseMs, fixture sabitleri
  models/user.types.ts     # TypeScript arayüzleri
  clients/users-api.client.ts
  helpers/assert-response.ts
tests/api/
  user-create-and-verify.spec.ts
```

## Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayabilirsiniz:

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `REQRES_API_KEY` | — | Opsiyonel. Varsa canlı API; yoksa yerel mock |
| `REQRES_BASE_URL` | `https://reqres.in` | API base URL |

## Gereksinimler

- Node.js 18+
- İnternet erişimi (Reqres.in canlı API)
