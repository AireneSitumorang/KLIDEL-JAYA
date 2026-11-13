import requests
import os
import json

urls = [
    "https://mcp.figma.com/mcp/upload/d386a703-063a-4256-9b31-4fc9335c40e6/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/fd160919-2487-4a8f-b9ec-143b76f36a49/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/c50877ed-7578-484f-aed9-2754ee0eda2a/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/95ad3ba2-e88c-4f2a-a976-35fec12e2ba9/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/cc9e9f25-045e-47ff-8546-91b13a556c78/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/a37a1383-1843-4a07-b31c-620e8f38751d/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/339253b0-f95f-4327-bcf6-f0836b819fd1/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/5dce3eb1-f9f7-4acf-80f3-b3819473c943/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/395cbe86-226a-4ae3-93d2-df7de58431ad/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/ebdb608d-cacd-4ca9-b3ed-aefc060ebf6f/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/6c57fbe0-0b7c-421f-a62b-06062dab78b6/submit?scaleMode=FILL&currentPageId=0%3A1",
    "https://mcp.figma.com/mcp/upload/e1e17120-5c13-4b1b-bd64-4f5b6deec5ae/submit?scaleMode=FILL&currentPageId=0%3A1"
]

files = [
    "01_pasien_beranda.svg",
    "02_pasien_pendaftaran_konsultasi.svg",
    "03_pasien_booking_jadwal_dokter.svg",
    "04_pasien_rekam_medis_lengkap.svg",
    "05_pasien_rm_riwayat_medis.svg",
    "06_pasien_rm_resep_obat.svg",
    "07_pasien_rm_dokumen_lab.svg",
    "08_dokter_soap_antrean.svg",
    "09_dokter_data_pasien.svg",
    "10_admin_manajemen_jadwal.svg",
    "11_auth_login_portal.svg",
    "12_system_ui_design_tokens.svg"
]

exports_dir = r"C:\laragon\www\KLINIK\exports"

for i, (fn, url) in enumerate(zip(files, urls)):
    fp = os.path.join(exports_dir, fn)
    print(f"[{i+1}/12] Uploading {fn} to Figma...")
    with open(fp, "rb") as f:
        file_bytes = f.read()
        res = requests.post(
            url,
            files={"file": (fn, file_bytes, "image/svg+xml")}
        )
        print(f"Status: {res.status_code}, Response: {res.text[:120]}")

print("All 12 vector screens uploaded to Figma Cloud!")
