"""Test HAL Knowledge RAG retrieval fix G-bis"""
import os
import json
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://omnia-crm-docs.preview.emergentagent.com').rstrip('/')
EMAIL = "mcnicastro@gmail.com"
PASSWORD = "Omn!pnWhzUXcUX4lPAmV"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": EMAIL, "password": PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text[:300]}"
    return s


def _ask(session, question):
    r = session.post(f"{BASE_URL}/api/app/hal/knowledge/ask", json={"question": question}, timeout=90)
    assert r.status_code == 200, f"ask failed: {r.status_code} {r.text[:300]}"
    return r.json()


def _dump(label, data):
    sources = data.get("sources", [])
    print(f"\n===== {label} =====")
    print(f"status={data.get('status')} confidence={data.get('confidence')}")
    for i, s in enumerate(sources[:5]):
        print(f"  #{i+1} {s.get('file')}::{s.get('chunk_id')} sim={s.get('similarity')}")
    ans = data.get("answer", "") or ""
    print(f"answer[0:250]={ans[:250]}")


def test_status_117(session):
    r = session.get(f"{BASE_URL}/api/app/hal/knowledge/status", timeout=30)
    assert r.status_code == 200, r.text[:300]
    data = r.json()
    print(f"\nSTATUS: {json.dumps(data, ensure_ascii=False)[:600]}")
    # manual_hal_indexed key expected
    count = data.get("manual_hal_indexed") or data.get("indexed") or data.get("total_voci")
    assert count == 117, f"Expected 117 indexed voices, got {count}. Full: {data}"


def test_gbis_primary_query(session):
    data = _ask(session, "Quanto costa un render Virtual Staging?")
    _dump("G-BIS PRIMARY", data)
    sources = data.get("sources", [])
    assert sources, "No sources returned"
    top = sources[0]
    assert "09-virtual-staging.yaml" in (top.get("file") or ""), f"Top-1 file wrong: {top}"
    assert top.get("chunk_id") == "staging.crediti-costo", f"Top-1 chunk wrong: {top}"
    assert (top.get("similarity") or 0) >= 0.20, f"Top-1 similarity too low: {top.get('similarity')}"
    ans = (data.get("answer") or "").lower()
    assert ("18" in ans and "credit" in ans) or "0,90" in ans or "0.90" in ans, f"Answer missing cost mention: {ans[:400]}"


def test_gbis_alternative_query(session):
    data = _ask(session, "Quanto spendo in crediti per lo staging?")
    _dump("G-BIS ALT", data)
    sources = data.get("sources", [])
    assert sources, "No sources returned"
    top = sources[0]
    assert "09-virtual-staging.yaml" in (top.get("file") or ""), f"Top-1 file wrong: {top}"
    assert top.get("chunk_id") == "staging.crediti-costo", f"Top-1 chunk wrong: {top}"


def test_cap10_hal_cos_e(session):
    data = _ask(session, "Cos'è HAL Agent in OMNIA?")
    _dump("CAP10 cos-e", data)
    top = data["sources"][0]
    assert "10-hal-agent-crm.yaml" in (top.get("file") or ""), f"file: {top}"
    assert top.get("chunk_id") == "hal.cos-e", f"chunk: {top}"
    assert (top.get("similarity") or 0) >= 0.15


def test_cap10_hal_improve(session):
    data = _ask(session, "A cosa serve il pulsante Migliora con HAL nei form?")
    _dump("CAP10 improve", data)
    top = data["sources"][0]
    assert "10-hal-agent-crm.yaml" in (top.get("file") or "")
    assert top.get("chunk_id") == "hal.improve-titolo-descrizione", f"chunk: {top}"
    assert (top.get("similarity") or 0) >= 0.15


def test_cap10_hal_limiti(session):
    data = _ask(session, "Cosa NON può fare HAL Agent?")
    _dump("CAP10 limiti", data)
    top = data["sources"][0]
    assert "10-hal-agent-crm.yaml" in (top.get("file") or "")
    assert top.get("chunk_id") == "hal.limiti-cosa-non-fa", f"chunk: {top}"
    assert (top.get("similarity") or 0) >= 0.15
