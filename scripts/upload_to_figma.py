import os
import sys
import urllib.request
import mimetypes

def upload_file(url, file_path):
    filename = os.path.basename(file_path)
    with open(file_path, 'rb') as f:
        file_bytes = f.read()

    boundary = '----FigmaUploadBoundary1234567890'
    body = bytearray()
    body.extend(f'--{boundary}\r\n'.encode('utf-8'))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode('utf-8'))
    body.extend(b'Content-Type: image/svg+xml\r\n\r\n')
    body.extend(file_bytes)
    body.extend(b'\r\n')
    body.extend(f'--{boundary}--\r\n'.encode('utf-8'))

    req = urllib.request.Request(
        url,
        data=body,
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'Content-Length': str(len(body))
        }
    )

    try:
        with urllib.request.urlopen(req) as resp:
            resp_data = resp.read().decode('utf-8')
            print(f"Uploaded {filename}: HTTP {resp.status} - {resp_data[:120]}")
            return True
    except Exception as e:
        print(f"Failed to upload {filename}: {e}")
        return False

def main():
    submit_urls = [
        "https://mcp.figma.com/mcp/upload/9748e8f3-9948-4cab-a1d5-1bc4b902b281/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/b6c0e1ba-bd08-422a-b814-ca3699fd268d/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/7c282748-67d0-4e80-8011-2f4f3a2bd150/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/7619e1e2-11bd-48c2-af03-074ecfad68c6/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/e7b8f17f-e334-4b58-a4c4-3a4ac4391a42/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/cd95eae3-19f6-445d-b669-db9b628af2ab/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/c93c8063-4faf-487e-82fa-9f838c37b4c0/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/703dc336-33fa-4c96-8d88-0d6876213452/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/4012f36b-3a54-447e-973f-c7a3f22d69b6/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/64739c3f-c542-452d-810f-33347f1d26b3/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/a008edeb-a691-483a-bc83-b7e9f7fb316e/submit?scaleMode=FILL",
        "https://mcp.figma.com/mcp/upload/1a5147bd-74e1-489a-8ee5-621a543132ef/submit?scaleMode=FILL"
    ]

    files = [
        "exports/01_pasien_beranda.svg",
        "exports/02_pasien_pendaftaran_konsultasi.svg",
        "exports/03_pasien_booking_jadwal_dokter.svg",
        "exports/04_pasien_rekam_medis_lengkap.svg",
        "exports/05_pasien_rm_riwayat_medis.svg",
        "exports/06_pasien_rm_resep_obat.svg",
        "exports/07_pasien_rm_dokumen_lab.svg",
        "exports/08_dokter_soap_antrean.svg",
        "exports/09_dokter_data_pasien.svg",
        "exports/10_admin_manajemen_jadwal.svg",
        "exports/11_auth_login_portal.svg",
        "exports/12_system_ui_design_tokens.svg"
    ]

    success = 0
    for url, fpath in zip(submit_urls, files):
        if os.path.exists(fpath):
            if upload_file(url, fpath):
                success += 1
        else:
            print(f"File not found: {fpath}")

    print(f"\nFinished uploading {success}/{len(files)} files to Figma Cloud!")

if __name__ == '__main__':
    main()
