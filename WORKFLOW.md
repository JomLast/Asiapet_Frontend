# Workflow — AsiaPet (สลับเครื่อง / pull–push / branch)

คู่มือสั้น ๆ สำหรับทำงานข้ามเครื่องโดยไม่ให้งานชนกัน
repo นี้ = **Frontend**. คู่กับ **Backend**: https://github.com/JomLast/Asiapet_Backend

---

## โครงสร้าง

```
            GitHub (ศูนย์กลาง / source of truth)
                 ▲              ▲
          push / pull     push / pull
                 │              │
          เครื่องนี้        คอมอีกเครื่อง (มี Node)
```

GitHub เป็นตัวกลาง **ต้อง push / pull เอง — ไม่ sync อัตโนมัติเหมือน Drive**

## Branch & Tag

| Ref | ใช้ทำอะไร |
|-----|----------|
| `main` | สถานะเสถียร (เป็น checkpoint อยู่แล้ว) — อย่าแก้ตรง ๆ |
| `verify/typecheck` | งานเช็ค/แก้ typecheck รอบนี้ทำที่นี่ แล้วค่อย merge เข้า main |
| tag `checkpoint/2026-06-17-shared-types` | จุดย้อนกลับ: หลังกู้ `shared/types` + แก้ search param |

## เริ่มงานบนคอมอีกเครื่อง (ครั้งแรก)

```powershell
git clone https://github.com/JomLast/Asiapet_Frontend.git
cd Asiapet_Frontend
git checkout verify/typecheck      # ดึง branch งานปัจจุบัน
cp .env.example .env
npm install
npm run typecheck                  # << ตัวที่ต้องยืนยันว่าเขียว
npm run dev                        # http://localhost:5173 (ต้องมี Backend รันที่ :4000)
```

> ต้องมี **Backend** รันที่ `http://localhost:4000` ก่อน (ดู repo Asiapet_Backend) — dev server จะ proxy `/api/*` ไปให้อัตโนมัติ

## กิจวัตรทุกครั้งที่ทำงาน (กฎเหล็ก)

```powershell
git pull                 # 1. ดึงของล่าสุด "ก่อน" เริ่มเสมอ
# ...แก้โค้ด...
git add -A
git commit -m "อธิบายสิ่งที่แก้"
git push                 # 2. ส่งขึ้น GitHub เมื่อเสร็จ
```

> ห้ามแก้ branch เดียวกันพร้อมกัน 2 เครื่องโดยไม่ `git pull` ก่อน → จะ conflict

## พอ typecheck เขียวแล้ว → รวมเข้า main

```powershell
git checkout main
git pull
git merge verify/typecheck
git push
```

## ย้อนกลับไปจุด checkpoint (ถ้าพัง)

```powershell
git checkout checkpoint/2026-06-17-shared-types   # ดูสถานะ ณ จุดนั้น
git diff checkpoint/2026-06-17-shared-types        # ดูว่าต่างจากปัจจุบันตรงไหน
```

---

## ⚠️ ข้อควรระวังเฉพาะโปรเจกต์นี้

`shared/types/index.ts` ถูก **คัดลอกไว้ทั้ง Frontend และ Backend** (ให้แต่ละ repo รันเองได้โดยไม่ต้องพึ่ง monorepo)
**ถ้าแก้ type ใน repo นี้ ต้องไปแก้ให้ตรงกันในอีก repo ด้วยเสมอ** ไม่งั้น contract ระหว่าง backend/frontend จะเพี้ยน
