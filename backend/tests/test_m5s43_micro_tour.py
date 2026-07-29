"""Backend tests for M5.S4.3 Micro-tour video (Sprint 3 · Item #5).

Ken Burns funzionante (ffmpeg locale), Sora 2 stub in v1.
"""
import asyncio
import os
import time
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://headless-crm.preview.emergentagent.com",
).rstrip("/")
ADMIN_EMAIL = "mcnicastro@gmail.com"
ADMIN_PASSWORD = "Forzainter2026."


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


@pytest.fixture(scope="module")
def test_property_with_photos(session):
    """Create a test property with 3 external photo URLs (public HTTPS)."""
    # small public JPGs (~10-30KB) that we know exist
    photo_urls = [
        "https://picsum.photos/seed/omnia-a/800/600",
        "https://picsum.photos/seed/omnia-b/800/600",
        "https://picsum.photos/seed/omnia-c/800/600",
    ]
    r = session.post(f"{BASE_URL}/api/app/properties", json={
        "title": "Video Test Property",
        "property_type": "appartamento",
        "operation": "sale",
        "price": 200000,
        "city": "Roma",
        "status": "active",
        "photos": [{"url": u, "order": i, "is_cover": i == 0} for i, u in enumerate(photo_urls)],
    })
    assert r.status_code == 201, r.text
    pid = r.json()["id"]
    yield pid, photo_urls
    session.delete(f"{BASE_URL}/api/app/properties/{pid}")


class TestKenBurnsGeneration:
    def test_kenburns_requires_auth(self, test_property_with_photos):
        pid, _ = test_property_with_photos
        r = requests.post(f"{BASE_URL}/api/app/videos/kenburns/property/{pid}", json={})
        assert r.status_code in (401, 403)

    def test_kenburns_accepts_property_with_photos(self, session, test_property_with_photos):
        pid, urls = test_property_with_photos
        r = session.post(f"{BASE_URL}/api/app/videos/kenburns/property/{pid}",
                         json={"duration_s": 15, "photo_urls": urls})
        assert r.status_code == 202, r.text
        data = r.json()
        assert data["mode"] == "ken_burns"
        assert data["duration_s"] == 15
        assert data["photos_count"] == 3
        assert data["status"] == "pending"
        assert data["video_id"]
        assert data["poll_url"].startswith("/api/app/videos/")

    def test_kenburns_rejects_no_photos(self, session):
        # Create a property without photos
        r = session.post(f"{BASE_URL}/api/app/properties", json={
            "title": "no photos", "property_type": "appartamento", "operation": "sale",
            "price": 100000, "city": "Milano", "status": "active",
        })
        pid = r.json()["id"]
        try:
            r2 = session.post(f"{BASE_URL}/api/app/videos/kenburns/property/{pid}", json={})
            assert r2.status_code == 422
        finally:
            session.delete(f"{BASE_URL}/api/app/properties/{pid}")

    def test_kenburns_duration_bounds(self, session, test_property_with_photos):
        pid, urls = test_property_with_photos
        # too short
        r = session.post(f"{BASE_URL}/api/app/videos/kenburns/property/{pid}",
                         json={"duration_s": 2, "photo_urls": urls})
        assert r.status_code == 422
        # too long
        r = session.post(f"{BASE_URL}/api/app/videos/kenburns/property/{pid}",
                         json={"duration_s": 60, "photo_urls": urls})
        assert r.status_code == 422

    def test_kenburns_property_not_owned(self, session):
        r = session.post(f"{BASE_URL}/api/app/videos/kenburns/property/does-not-exist",
                         json={"duration_s": 15})
        assert r.status_code == 404


class TestVideoStatusEndpoint:
    def test_video_not_found(self, session):
        r = session.get(f"{BASE_URL}/api/app/videos/00000000-0000-0000-0000-000000000000")
        assert r.status_code == 404


class TestSora2Stub:
    def test_sora2_stub_returns_501(self, session, test_property_with_photos):
        pid, _ = test_property_with_photos
        r = session.post(f"{BASE_URL}/api/app/videos/sora2/property/{pid}")
        assert r.status_code == 501
        assert "sora2" in str(r.json().get("detail", "")).lower()


class TestPublicKenBurns:
    def test_public_endpoint_404_for_non_public_property(self):
        # A random UUID that doesn't exist should 404
        r = requests.post(f"{BASE_URL}/api/cloud/videos/kenburns/property/00000000-0000-0000-0000-000000000000",
                          json={"duration_s": 15})
        assert r.status_code == 404


class TestFfmpegAvailable:
    def test_ffmpeg_installed(self):
        import subprocess
        r = subprocess.run(["ffmpeg", "-version"], capture_output=True, timeout=5)
        assert r.returncode == 0
        assert b"ffmpeg version" in r.stdout
