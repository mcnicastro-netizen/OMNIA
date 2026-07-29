"""OMNIA — Subscription plan catalog (M4.S3).

Pricing "fase lancio" (primi 12 mesi) as defined in PROGRAMMA_OMNIA.md.
Post-traction pricing lives here too as a switchable dict; only one is
active depending on `PRICING_PHASE` env var (default: launch).

⚠️ Nessun brand mention (D-051). Pubblichiamo sempre solo il ns. listino
in €/mese, mai comparazioni nominative con altri gestionali/portali.
"""
from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field

PlanTier = Literal["starter", "pro", "agency", "enterprise"]


class PlanFeature(BaseModel):
    key: str
    label_it: str
    label_en: str
    label_es: str
    included: bool = True


class Plan(BaseModel):
    tier: PlanTier
    name: str
    price_monthly: float  # €
    price_yearly: float  # € (2 mesi in omaggio)
    max_agents: int  # -1 = illimitato
    max_properties: int  # -1 = illimitato
    features: List[PlanFeature] = Field(default_factory=list)
    stripe_price_id_env: str  # env var name (letto lazy)
    trial_days: int = 14
    launch_discount_months: int = 0  # es. Starter: 3 mesi gratis in lancio


# --- FASE LANCIO (primi 12 mesi, D-024) --------------------------------
LAUNCH_PLANS: Dict[PlanTier, Plan] = {
    "starter": Plan(
        tier="starter",
        name="Starter",
        price_monthly=19.0,
        price_yearly=190.0,
        max_agents=1,
        max_properties=20,
        stripe_price_id_env="STRIPE_PRICE_STARTER",
        launch_discount_months=3,
    ),
    "pro": Plan(
        tier="pro",
        name="Pro",
        price_monthly=29.0,
        price_yearly=290.0,
        max_agents=3,
        max_properties=100,
        stripe_price_id_env="STRIPE_PRICE_STARTER",  # placeholder — mappare quando arriva
    ),
    "agency": Plan(
        tier="agency",
        name="Agency",
        price_monthly=79.0,
        price_yearly=790.0,
        max_agents=-1,
        max_properties=-1,
        stripe_price_id_env="STRIPE_PRICE_GROWTH",
    ),
    "enterprise": Plan(
        tier="enterprise",
        name="Enterprise",
        price_monthly=299.0,
        price_yearly=2990.0,
        max_agents=-1,
        max_properties=-1,
        stripe_price_id_env="STRIPE_PRICE_ENTERPRISE",
    ),
}

# --- FASE POST-TRACTION (dopo 100 agenzie paganti) ---------------------
POST_TRACTION_PLANS: Dict[PlanTier, Plan] = {
    "starter": Plan(tier="starter", name="Starter", price_monthly=19.0,
                    price_yearly=190.0, max_agents=1, max_properties=20,
                    stripe_price_id_env="STRIPE_PRICE_STARTER"),
    "pro": Plan(tier="pro", name="Pro", price_monthly=49.0,
                price_yearly=490.0, max_agents=3, max_properties=100,
                stripe_price_id_env="STRIPE_PRICE_STARTER"),
    "agency": Plan(tier="agency", name="Agency", price_monthly=149.0,
                   price_yearly=1490.0, max_agents=-1, max_properties=-1,
                   stripe_price_id_env="STRIPE_PRICE_GROWTH"),
    "enterprise": Plan(tier="enterprise", name="Enterprise", price_monthly=499.0,
                       price_yearly=4990.0, max_agents=-1, max_properties=-1,
                       stripe_price_id_env="STRIPE_PRICE_ENTERPRISE"),
}


def get_active_catalog() -> Dict[PlanTier, Plan]:
    """Return the currently active plan catalog based on PRICING_PHASE env."""
    import os
    phase = (os.environ.get("PRICING_PHASE") or "launch").lower()
    if phase == "post_traction":
        return POST_TRACTION_PLANS
    return LAUNCH_PLANS


def get_plan(tier: PlanTier) -> Optional[Plan]:
    return get_active_catalog().get(tier)


# --- Credit packages (M4.S4 pay-as-you-go) -----------------------------

class CreditPackage(BaseModel):
    key: str
    credits: int
    price_eur: float
    stripe_price_id_env: str


CREDIT_PACKAGES: List[CreditPackage] = [
    CreditPackage(key="pkg_50", credits=50, price_eur=9.0,
                  stripe_price_id_env="STRIPE_PRICE_CREDITS_50"),
    CreditPackage(key="pkg_200", credits=200, price_eur=29.0,
                  stripe_price_id_env="STRIPE_PRICE_CREDITS_200"),
    CreditPackage(key="pkg_1000", credits=1000, price_eur=119.0,
                  stripe_price_id_env="STRIPE_PRICE_CREDITS_1000"),
]

# --- Credit consumption catalog (D-024 pricing) ------------------------
CREDIT_COSTS: Dict[str, int] = {
    "valuator_pdf": 2,        # PDF valutazione UNI 10750
    "visura_catastale": 5,    # visura catasto
    "ape_search": 3,          # ricerca APE regionale
    "sms_notification": 1,    # SMS al cliente
    "top_promotion": 20,      # promozione Top 7 giorni
    "premium_promotion": 50,  # Premium 15 giorni
    "featured_promotion": 100,  # In Evidenza 30 giorni
    "hal_conversation": 1,    # per messaggio HAL Agents
    "virtual_staging_render": 15,  # render staging AI
    "micro_tour_render": 25,  # video 10s Ken Burns
}
