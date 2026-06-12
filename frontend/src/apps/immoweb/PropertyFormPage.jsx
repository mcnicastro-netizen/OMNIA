import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import AgencyShell from "./components/AgencyShell";
import PhotoUploader from "./components/PhotoUploader";
import { api } from "../../shared/lib/api";
import { formatApiErrorDetail } from "../../shared/lib/auth";

const TYPES = [
  "appartamento", "villa", "villetta_a_schiera", "loft", "attico", "monolocale",
  "rustico_casale", "ufficio", "negozio", "magazzino", "capannone", "garage_box",
  "terreno_agricolo", "terreno_edificabile", "palazzo_stabile", "altro",
];
const OPS = ["sale", "rent", "rent_to_buy", "auction"];
const STATUSES = ["draft", "active", "reserved", "sold", "rented", "withdrawn"];
const CONDITIONS = ["nuovo", "ottime", "buone", "da_ristrutturare", "ristrutturato"];
const FURNISHED = ["arredato", "parz_arredato", "non_arredato"];
const HEATING = ["autonomo", "centralizzato", "assente"];
const ENERGY_CLASSES = ["A4", "A3", "A2", "A1", "A", "B", "C", "D", "E", "F", "G"];

const FEATURES = [
  "balcone", "terrazza", "giardino", "piscina", "ascensore",
  "aria_condizionata", "riscaldamento_autonomo", "cantina", "soffitta",
  "posto_auto", "box_auto", "portineria", "videocitofono", "allarme",
  "porta_blindata", "cucina_abitabile", "camino", "parquet",
  "vista_panoramica", "luminoso", "arredato", "pannelli_solari",
  "cancello_elettrico", "impianto_domotico", "accesso_disabili",
];

const empty = {
  title: "", description: "", reference_code: "",
  property_type: "appartamento", operation: "sale", status: "draft", condition: "",
  address: "", city: "", province: "", postal_code: "", zone: "", hide_address: false,
  price: "", rent_monthly: "", condo_fees: "", price_negotiable: false,
  surface_sqm: "", rooms: "", bedrooms: "", bathrooms: "", floor: "", total_floors: "",
  year_built: "", furnished: "",
  energy: { energy_class: "", energy_value: "", heating: "" },
  features: Object.fromEntries(FEATURES.map((k) => [k, false])),
  owner: { name: "", phone: "", email: "" },
  photos: [],
};

export default function PropertyFormPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const { id } = useParams();
  const nav = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/app/properties/${id}`).then((r) => {
      const d = r.data;
      setForm({
        ...empty,
        ...d,
        energy: { ...empty.energy, ...(d.energy || {}) },
        features: { ...empty.features, ...(d.features || {}) },
        owner: { ...empty.owner, ...(d.owner || {}) },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const upd = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updNested = (group, key, value) => setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const numFields = ["price", "rent_monthly", "condo_fees", "surface_sqm", "rooms", "bedrooms", "bathrooms", "floor", "total_floors", "year_built"];
      const cleanGroup = (obj) => Object.fromEntries(Object.entries(obj || {}).filter(([, v]) => v !== "" && v != null));
      const payload = { ...form };
      numFields.forEach((f) => {
        if (payload[f] === "" || payload[f] == null) delete payload[f];
        else payload[f] = Number(payload[f]);
      });
      if (payload.condition === "") delete payload.condition;
      if (payload.furnished === "") delete payload.furnished;
      payload.energy = cleanGroup(form.energy);
      if (payload.energy.energy_value) payload.energy.energy_value = Number(payload.energy.energy_value);
      if (!Object.keys(payload.energy).length) delete payload.energy;
      payload.owner = cleanGroup(form.owner);
      if (!Object.keys(payload.owner).length) delete payload.owner;
      payload.photos = form.photos || [];

      if (isEdit) {
        await api.patch(`/app/properties/${id}`, payload);
      } else {
        await api.post(`/app/properties`, payload);
      }
      nav(`/${lang}/app/properties`, { replace: true });
    } catch (err) {
      setError(formatApiErrorDetail(err?.response?.data?.detail) || t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm(t("properties.delete_confirm"))) return;
    await api.delete(`/app/properties/${id}`);
    nav(`/${lang}/app/properties`, { replace: true });
  };

  return (
    <AgencyShell current="properties">
      <section data-testid="property-form-page" className="max-w-4xl space-y-6">
        <div>
          <Link to={`/${lang}/app/properties`} className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900">
            {t("properties.back_to_list")}
          </Link>
          <h1
            className="text-3xl md:text-4xl tracking-tight mt-2"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {isEdit ? t("properties.form_title_edit") : t("properties.form_title_new")}
          </h1>
        </div>

        <form onSubmit={submit} className="space-y-8 bg-white border border-stone-200 rounded-lg p-6 md:p-8">
          {/* Basics */}
          <Section label={t("properties.section_basics")}>
            <Field label={t("properties.field_title")} required>
              <input data-testid="prop-title" required value={form.title} onChange={(e) => upd("title", e.target.value)} className="form-input" />
            </Field>
            <Field label={t("properties.field_description")}>
              <textarea value={form.description || ""} onChange={(e) => upd("description", e.target.value)} className="form-input h-24" />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label={t("properties.field_type")}>
                <select value={form.property_type} onChange={(e) => upd("property_type", e.target.value)} className="form-input">
                  {TYPES.map((tp) => <option key={tp} value={tp}>{t(`properties.type_${tp}`)}</option>)}
                </select>
              </Field>
              <Field label={t("properties.field_operation")}>
                <select value={form.operation} onChange={(e) => upd("operation", e.target.value)} className="form-input">
                  {OPS.map((op) => <option key={op} value={op}>{t(`properties.op_${op}`)}</option>)}
                </select>
              </Field>
              <Field label={t("properties.field_status")}>
                <select value={form.status} onChange={(e) => upd("status", e.target.value)} className="form-input">
                  {STATUSES.map((s) => <option key={s} value={s}>{t(`properties.status_${s}`)}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t("properties.field_reference")}>
                <input value={form.reference_code || ""} onChange={(e) => upd("reference_code", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_condition")}>
                <select value={form.condition || ""} onChange={(e) => upd("condition", e.target.value)} className="form-input">
                  <option value="">—</option>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{t(`properties.cond_${c}`)}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          {/* Location */}
          <Section label={t("properties.section_location")}>
            <Field label={t("properties.field_address")}>
              <input value={form.address || ""} onChange={(e) => upd("address", e.target.value)} className="form-input" />
            </Field>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label={t("properties.field_city")} required>
                <input data-testid="prop-city" required value={form.city} onChange={(e) => upd("city", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_province")}>
                <input maxLength={2} value={form.province || ""} onChange={(e) => upd("province", e.target.value.toUpperCase())} className="form-input" />
              </Field>
              <Field label={t("properties.field_postal_code")}>
                <input value={form.postal_code || ""} onChange={(e) => upd("postal_code", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_zone")}>
                <input value={form.zone || ""} onChange={(e) => upd("zone", e.target.value)} className="form-input" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input type="checkbox" checked={form.hide_address} onChange={(e) => upd("hide_address", e.target.checked)} />
              {t("properties.field_hide_address")}
            </label>
          </Section>

          {/* Economics */}
          <Section label={t("properties.section_economics")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label={t("properties.field_price")}>
                <input type="number" data-testid="prop-price" value={form.price} onChange={(e) => upd("price", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_rent")}>
                <input type="number" value={form.rent_monthly} onChange={(e) => upd("rent_monthly", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_condo_fees")}>
                <input type="number" value={form.condo_fees} onChange={(e) => upd("condo_fees", e.target.value)} className="form-input" />
              </Field>
            </div>
          </Section>

          {/* Size */}
          <Section label={t("properties.section_size")}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label={t("properties.field_surface")}>
                <input type="number" value={form.surface_sqm} onChange={(e) => upd("surface_sqm", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_rooms")}>
                <input type="number" value={form.rooms} onChange={(e) => upd("rooms", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_bedrooms")}>
                <input type="number" value={form.bedrooms} onChange={(e) => upd("bedrooms", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_bathrooms")}>
                <input type="number" value={form.bathrooms} onChange={(e) => upd("bathrooms", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_floor")}>
                <input type="number" value={form.floor} onChange={(e) => upd("floor", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_total_floors")}>
                <input type="number" value={form.total_floors} onChange={(e) => upd("total_floors", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_year")}>
                <input type="number" value={form.year_built} onChange={(e) => upd("year_built", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_furnished")}>
                <select value={form.furnished || ""} onChange={(e) => upd("furnished", e.target.value)} className="form-input">
                  <option value="">—</option>
                  {FURNISHED.map((f) => <option key={f} value={f}>{t(`properties.furn_${f}`)}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          {/* Features (25 checkboxes) */}
          <Section label={t("properties.section_features")}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {FEATURES.map((f) => (
                <label key={f} className="flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    data-testid={`feat-${f}`}
                    checked={!!form.features[f]}
                    onChange={(e) => updNested("features", f, e.target.checked)}
                  />
                  {t(`properties.feat_${f}`)}
                </label>
              ))}
            </div>
          </Section>

          {/* Energy */}
          <Section label={t("properties.section_energy")}>
            <div className="grid grid-cols-3 gap-4">
              <Field label={t("properties.field_energy_class")}>
                <select value={form.energy.energy_class || ""} onChange={(e) => updNested("energy", "energy_class", e.target.value)} className="form-input">
                  <option value="">—</option>
                  {ENERGY_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t("properties.field_energy_value")}>
                <input type="number" value={form.energy.energy_value || ""} onChange={(e) => updNested("energy", "energy_value", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_heating")}>
                <select value={form.energy.heating || ""} onChange={(e) => updNested("energy", "heating", e.target.value)} className="form-input">
                  <option value="">—</option>
                  {HEATING.map((h) => <option key={h} value={h}>{t(`properties.heat_${h}`)}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          {/* Photos */}
          <Section label="Foto immobile">
            <PhotoUploader photos={form.photos || []} onChange={(photos) => upd("photos", photos)} max={15} />
          </Section>

          {/* Owner (reserved) */}
          <Section label={t("properties.section_owner")}>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded">
              🔒 Questi dati sono riservati: non vengono mai mostrati pubblicamente o nei portali esterni.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label={t("properties.field_owner_name")}>
                <input value={form.owner.name || ""} onChange={(e) => updNested("owner", "name", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_owner_phone")}>
                <input value={form.owner.phone || ""} onChange={(e) => updNested("owner", "phone", e.target.value)} className="form-input" />
              </Field>
              <Field label={t("properties.field_owner_email")}>
                <input type="email" value={form.owner.email || ""} onChange={(e) => updNested("owner", "email", e.target.value)} className="form-input" />
              </Field>
            </div>
          </Section>

          {error && (
            <p data-testid="prop-error" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-stone-200">
            {isEdit && (
              <button type="button" onClick={onDelete} className="text-xs uppercase tracking-widest text-red-700 hover:text-red-900">
                {t("properties.delete")}
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              data-testid="prop-save-btn"
              className="ml-auto px-6 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest font-medium rounded-md hover:bg-stone-700 disabled:opacity-50"
            >
              {saving ? t("common.loading") : t("properties.save")}
            </button>
          </div>
        </form>

        <style>{`
          .form-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            background: white;
            border: 1px solid #d6d3d1;
            border-radius: 6px;
            font-size: 0.875rem;
          }
          .form-input:focus {
            outline: none;
            border-color: #1c1917;
            box-shadow: 0 0 0 3px rgba(28,25,23,0.06);
          }
        `}</style>
      </section>
    </AgencyShell>
  );
}

function Section({ label, children }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-2">{label}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-1.5">
        {label}{required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
