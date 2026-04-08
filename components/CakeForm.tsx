"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1 – About You
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;

  // Step 2 – The Event
  eventType: string;
  eventTypeOther: string;
  eventDate: string;
  guestCount: string;
  deliveryMethod: string;
  deliveryAddress: string;

  // Step 3 – The Cake
  cakeTiers: string;
  servings: string;
  cakeFlavors: string[];
  cakeFlavorOther: string;
  fillingFlavors: string[];
  fillingFlavorOther: string;
  icingType: string;
  icingFinish: string;

  // Step 4 – The Design
  colorPalette: string;
  cakeShape: string;
  designStyle: string[];
  designDescription: string;
  inspirationImages: File[];

  // Step 5 – Final Details
  budgetRange: string;
  dietaryNeeds: string[];
  dietaryOther: string;
  hearAboutUs: string;
  additionalNotes: string;
}

const initialData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  instagram: "",
  eventType: "",
  eventTypeOther: "",
  eventDate: "",
  guestCount: "",
  deliveryMethod: "",
  deliveryAddress: "",
  cakeTiers: "",
  servings: "",
  cakeFlavors: [],
  cakeFlavorOther: "",
  fillingFlavors: [],
  fillingFlavorOther: "",
  icingType: "",
  icingFinish: "",
  colorPalette: "",
  cakeShape: "",
  designStyle: [],
  designDescription: "",
  inspirationImages: [],
  budgetRange: "",
  dietaryNeeds: [],
  dietaryOther: "",
  hearAboutUs: "",
  additionalNotes: "",
};

const STEPS = [
  { number: 1, label: "About You" },
  { number: 2, label: "The Event" },
  { number: 3, label: "The Cake" },
  { number: 4, label: "The Design" },
  { number: 5, label: "Final Details" },
];

const CAKE_FLAVORS = [
  "Classic Vanilla",
  "Dark Chocolate",
  "Red Velvet",
  "Lemon",
  "Carrot",
  "Funfetti / Confetti",
  "Champagne",
  "Strawberry",
  "Brown Butter",
  "Almond",
  "Other",
];

const FILLING_FLAVORS = [
  "Vanilla Buttercream",
  "Chocolate Ganache",
  "Fresh Fruit",
  "Lemon Curd",
  "Cream Cheese",
  "Raspberry Jam",
  "Salted Caramel",
  "Nutella / Hazelnut",
  "Whipped Cream",
  "Mousse",
  "Other",
];

const DESIGN_STYLES = [
  "Minimalist / Clean",
  "Romantic / Floral",
  "Vintage / Retro",
  "Modern Geometric",
  "Whimsical / Playful",
  "Rustic / Boho",
  "Elegant / Formal",
  "Abstract / Artistic",
  "Nature-Inspired",
  "Themed / Character",
];

const DIETARY_OPTIONS = [
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Vegan",
  "Egg-Free",
  "Kosher",
  "Halal",
  "Other",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <p className="font-lora text-xs tracking-[0.25em] uppercase text-fernhollow mb-3">
        Step {step} of {STEPS.length}
      </p>
      <h2 className="font-cinzel text-4xl md:text-5xl font-light text-inkwell leading-tight mb-3">
        {title}
      </h2>
      <div className="deco-line" />
      <p className="font-lora text-sm text-ashwood mt-3 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-ghostgrass font-lora italic">{hint}</p>
      )}
    </div>
  );
}

function CheckGrid({
  options,
  selected,
  onChange,
  type = "checkbox",
  columns = 2,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  type?: "checkbox" | "radio";
  columns?: number;
}) {
  const toggle = (option: string) => {
    if (type === "radio") {
      onChange([option]);
    } else {
      if (selected.includes(option)) {
        onChange(selected.filter((s) => s !== option));
      } else {
        onChange([...selected, option]);
      }
    }
  };

  return (
    <div
      className={clsx(
        "grid gap-3",
        columns === 2 ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 border text-left transition-all duration-200 font-lora text-sm",
              isSelected
                ? "border-mossmoor bg-mossmoor/5 text-inkwell"
                : "border-burrowdust/40 text-ashwood hover:border-mossmoor/50"
            )}
            style={{ borderRadius: "var(--radius-sm)" }}
          >
            <span
              className={clsx(
                "w-4 h-4 flex-shrink-0 border transition-all duration-200 flex items-center justify-center",
                type === "radio" ? "rounded-full" : "",
                isSelected
                  ? "border-mossmoor bg-mossmoor"
                  : "border-burrowdust"
              )}
            >
              {isSelected && (
                <span
                  className={clsx(
                    "bg-parchment",
                    type === "radio" ? "w-1.5 h-1.5 rounded-full" : "w-2 h-2"
                  )}
                />
              )}
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

// ─── Image Drop Zone ──────────────────────────────────────────────────────────

function ImageDropzone({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onChange([...files, ...accepted].slice(0, 8));
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxFiles: 8,
  });

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed transition-all duration-200 cursor-pointer p-10 text-center",
          isDragActive
            ? "border-fernhollow bg-fernhollow/10"
            : "border-burrowdust/50 hover:border-copperpot hover:bg-copperpot/5"
        )}
        style={{ borderRadius: "var(--radius-md)" }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-8 h-8 text-burrowdust"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p className="font-lora text-sm text-ashwood">
              {isDragActive
                ? "Let it go — we've got it"
                : "Drop your inspiration images here 🌿"}
            </p>
            <p className="font-lora text-xs text-ghostgrass italic mt-1">
              or click to browse · up to 8 images · JPG, PNG, WEBP
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {files.map((file, i) => (
            <div key={i} className="relative group aspect-square">
              <img
                src={URL.createObjectURL(file)}
                alt={`Inspiration ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ borderRadius: "var(--radius-sm)" }}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-mossmoor text-parchment text-xs
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1 mb-12">
      {STEPS.map((s, i) => (
        <div key={s.number} className="flex items-center gap-1 flex-1">
          <div
            className={clsx(
              "h-0.5 flex-1 transition-all duration-500",
              step >= s.number ? "bg-fernhollow" : "bg-mossmoor/10"
            )}
          />
          {i < STEPS.length - 1 && (
            <div
              className={clsx(
                "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500",
                step > s.number
                  ? "bg-fernhollow"
                  : step === s.number
                  ? "bg-copperpot ring-2 ring-copperpot/30"
                  : "bg-mossmoor/15"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function StepAboutYou({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div className="step-enter">
      <SectionTitle
        step={1}
        title="About You"
        subtitle="Let's start with the basics — it's lovely to know who we're making something for."
      />
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name">
            <input
              className="input-field"
              placeholder="Your name, please"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </Field>
          <Field label="Last Name">
            <input
              className="input-field"
              placeholder="And your surname"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Email Address">
          <input
            className="input-field"
            type="email"
            placeholder="Where shall we reach you?"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </Field>

        <Field label="Phone Number">
          <input
            className="input-field"
            type="tel"
            placeholder="(555) 000-0000"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </Field>

      </FieldGroup>
    </div>
  );
}

function StepTheEvent({
  data,
  onChange,
  onMulti,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  onMulti: (k: keyof FormData, v: string[]) => void;
}) {
  const eventTypes = [
    "Wedding",
    "Birthday",
    "Baby Shower",
    "Bridal Shower",
    "Anniversary",
    "Graduation",
    "Corporate / Work",
    "Holiday",
    "Gender Reveal",
    "Other",
  ];

  return (
    <div className="step-enter">
      <SectionTitle
        step={2}
        title="The Event"
        subtitle="Tell us about the occasion — so we can design something that feels right at home there."
      />
      <FieldGroup>
        <Field label="Type of Event">
          <CheckGrid
            options={eventTypes}
            selected={data.eventType ? [data.eventType] : []}
            onChange={(v) => onChange("eventType", v[0] ?? "")}
            type="radio"
          />
        </Field>

        {data.eventType === "Other" && (
          <Field label="Tell Us About It">
            <input
              className="input-field"
              placeholder="What's the occasion?"
              value={data.eventTypeOther}
              onChange={(e) => onChange("eventTypeOther", e.target.value)}
            />
          </Field>
        )}

        <Field
          label="When Do You Need It By?"
          hint="Please reach out at least 3–4 weeks in advance for custom designs."
        >
          <input
            className="input-field"
            type="date"
            value={data.eventDate}
            onChange={(e) => onChange("eventDate", e.target.value)}
          />
        </Field>

        <Field label="Approximate Guest Count">
          <select
            className="select-field"
            value={data.guestCount}
            onChange={(e) => onChange("guestCount", e.target.value)}
          >
            <option value="">How many mouths to feed?</option>
            <option>1–10</option>
            <option>11–25</option>
            <option>26–50</option>
            <option>51–75</option>
            <option>76–100</option>
            <option>101–150</option>
            <option>150+</option>
          </select>
        </Field>

        <Field label="Pickup or Delivery?">
          <CheckGrid
            options={["I'll pick it up", "Delivery, please"]}
            selected={data.deliveryMethod ? [data.deliveryMethod] : []}
            onChange={(v) => onChange("deliveryMethod", v[0] ?? "")}
            type="radio"
            columns={2}
          />
        </Field>

        {data.deliveryMethod === "Delivery, please" && (
          <Field
            label="Delivery Address"
            hint="A delivery fee may apply depending on distance."
          >
            <input
              className="input-field"
              placeholder="Street, City, State, ZIP"
              value={data.deliveryAddress}
              onChange={(e) => onChange("deliveryAddress", e.target.value)}
            />
          </Field>
        )}
      </FieldGroup>
    </div>
  );
}

function StepTheCake({
  data,
  onChange,
  onMulti,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  onMulti: (k: keyof FormData, v: string[]) => void;
}) {
  return (
    <div className="step-enter">
      <SectionTitle
        step={3}
        title="The Cake"
        subtitle="Now for the delicious part — layers, flavours, and all the good bits in between."
      />
      <FieldGroup>
        <Field label="Number of Tiers">
          <CheckGrid
            options={["1 Tier", "2 Tiers", "3 Tiers", "4+ Tiers", "Not Sure"]}
            selected={data.cakeTiers ? [data.cakeTiers] : []}
            onChange={(v) => onChange("cakeTiers", v[0] ?? "")}
            type="radio"
          />
        </Field>

        <Field label="Servings Needed">
          <select
            className="select-field"
            value={data.servings}
            onChange={(e) => onChange("servings", e.target.value)}
          >
            <option value="">How many servings?</option>
            <option>6–10 servings</option>
            <option>12–20 servings</option>
            <option>24–36 servings</option>
            <option>40–50 servings</option>
            <option>60–75 servings</option>
            <option>80–100 servings</option>
            <option>100+ servings</option>
            <option>Not sure — help me decide</option>
          </select>
        </Field>

        <Field label="Cake Flavour(s)" hint="Select all that apply if multiple tiers.">
          <CheckGrid
            options={CAKE_FLAVORS}
            selected={data.cakeFlavors}
            onChange={(v) => onMulti("cakeFlavors", v)}
          />
          {data.cakeFlavors.includes("Other") && (
            <input
              className="input-field mt-3"
              placeholder="Describe your preferred flavour..."
              value={data.cakeFlavorOther}
              onChange={(e) => onChange("cakeFlavorOther", e.target.value)}
            />
          )}
        </Field>

        <Field label="Filling / Between-Layer Flavour(s)">
          <CheckGrid
            options={FILLING_FLAVORS}
            selected={data.fillingFlavors}
            onChange={(v) => onMulti("fillingFlavors", v)}
          />
          {data.fillingFlavors.includes("Other") && (
            <input
              className="input-field mt-3"
              placeholder="Describe your preferred filling..."
              value={data.fillingFlavorOther}
              onChange={(e) => onChange("fillingFlavorOther", e.target.value)}
            />
          )}
        </Field>

        <Field label="Icing / Frosting Type">
          <CheckGrid
            options={[
              "Buttercream",
              "Fondant",
              "Swiss Meringue",
              "Whipped Cream",
              "Cream Cheese",
              "Naked / Semi-Naked",
              "Mirror Glaze",
              "No Preference",
            ]}
            selected={data.icingType ? [data.icingType] : []}
            onChange={(v) => onChange("icingType", v[0] ?? "")}
            type="radio"
          />
        </Field>

        <Field label="Frosting Finish">
          <CheckGrid
            options={[
              "Smooth",
              "Textured / Rustic",
              "Ruffled",
              "Painted",
              "Metallic / Shimmer",
              "No Preference",
            ]}
            selected={data.icingFinish ? [data.icingFinish] : []}
            onChange={(v) => onChange("icingFinish", v[0] ?? "")}
            type="radio"
          />
        </Field>
      </FieldGroup>
    </div>
  );
}

function StepTheDesign({
  data,
  onChange,
  onMulti,
  onFiles,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  onMulti: (k: keyof FormData, v: string[]) => void;
  onFiles: (files: File[]) => void;
}) {
  return (
    <div className="step-enter">
      <SectionTitle
        step={4}
        title="The Design"
        subtitle="This is where your vision comes to life. Paint us a picture — we love a good story."
      />
      <FieldGroup>
        <Field label="Cake Shape">
          <CheckGrid
            options={[
              "Round",
              "Square",
              "Rectangle",
              "Hexagon",
              "Heart",
              "Sculpted / 3D",
              "Not Sure",
            ]}
            selected={data.cakeShape ? [data.cakeShape] : []}
            onChange={(v) => onChange("cakeShape", v[0] ?? "")}
            type="radio"
          />
        </Field>

        <Field label="Design Style" hint="Select everything that resonates.">
          <CheckGrid
            options={DESIGN_STYLES}
            selected={data.designStyle}
            onChange={(v) => onMulti("designStyle", v)}
          />
        </Field>

        <Field
          label="Colour Palette"
          hint="e.g. 'Dusty rose, ivory, and sage' or 'Bold black and gold.'"
        >
          <input
            className="input-field"
            placeholder="Describe your colours or palette..."
            value={data.colorPalette}
            onChange={(e) => onChange("colorPalette", e.target.value)}
          />
        </Field>

        <Field
          label="Describe Your Vision"
          hint="Share any details, themes, words, feelings, or specific elements you'd love included."
        >
          <textarea
            className="input-field resize-none"
            rows={5}
            placeholder="I'm imagining something that feels like... I'd love to include... The vibe should be..."
            value={data.designDescription}
            onChange={(e) => onChange("designDescription", e.target.value)}
          />
        </Field>

        <Field
          label="Inspiration Images"
          hint="Cakes you love, colour swatches, florals, venues — anything that captures the feel."
        >
          <ImageDropzone
            files={data.inspirationImages}
            onChange={onFiles}
          />
        </Field>
      </FieldGroup>
    </div>
  );
}

function StepFinalDetails({
  data,
  onChange,
  onMulti,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
  onMulti: (k: keyof FormData, v: string[]) => void;
}) {
  return (
    <div className="step-enter">
      <SectionTitle
        step={5}
        title="Final Details"
        subtitle="Almost there. Just a few final touches before we get things started."
      />
      <FieldGroup>
        <Field
          label="Budget Range"
          hint="Custom cakes are priced by complexity, servings, and design. This helps us point you in the right direction."
        >
          <CheckGrid
            options={[
              "Under $100",
              "$100 – $200",
              "$200 – $350",
              "$350 – $500",
              "$500 – $750",
              "$750+",
              "Flexible / Not Sure",
            ]}
            selected={data.budgetRange ? [data.budgetRange] : []}
            onChange={(v) => onChange("budgetRange", v[0] ?? "")}
            type="radio"
          />
        </Field>

        <Field
          label="Dietary Restrictions or Allergies"
          hint="We'll do our best to accommodate. Please note our kitchen is not allergen-free."
        >
          <CheckGrid
            options={DIETARY_OPTIONS}
            selected={data.dietaryNeeds}
            onChange={(v) => onMulti("dietaryNeeds", v)}
          />
          {data.dietaryNeeds.includes("Other") && (
            <input
              className="input-field mt-3"
              placeholder="Describe any other dietary needs..."
              value={data.dietaryOther}
              onChange={(e) => onChange("dietaryOther", e.target.value)}
            />
          )}
        </Field>

        <Field label="How Did You Find Us?">
          <select
            className="select-field"
            value={data.hearAboutUs}
            onChange={(e) => onChange("hearAboutUs", e.target.value)}
          >
            <option value="">How did you hear about us?</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Word of Mouth / Referral</option>
            <option>Google Search</option>
            <option>Previous Customer</option>
            <option>Wedding Vendor / Planner</option>
            <option>Other</option>
          </select>
        </Field>

        <Field
          label="Anything Else?"
          hint="Questions, thoughts, or anything we should know before we get started."
        >
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder="Feel free to share anything else on your mind..."
            value={data.additionalNotes}
            onChange={(e) => onChange("additionalNotes", e.target.value)}
          />
        </Field>
      </FieldGroup>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="step-enter flex flex-col items-center text-center py-16">
      <div
        className="w-16 h-16 border border-burrowdust flex items-center justify-center mb-8"
        style={{ borderRadius: "var(--radius-xl)" }}
      >
        <svg
          className="w-7 h-7 text-fernhollow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p className="font-lora text-xs tracking-[0.25em] uppercase text-fernhollow mb-4">
        Wonderful!
      </p>
      <h2 className="font-cinzel text-5xl font-light text-inkwell mb-4">
        Thank You
      </h2>
      <div className="divider w-48 mx-auto">
        <span>🌿</span>
      </div>
      <p className="font-lora text-sm text-ashwood mt-6 max-w-sm leading-relaxed">
        We've got your details and we'll be in touch soon — usually within 2–3 days — to talk through the vision and make sure everything's just right.
      </p>
      <p className="font-lora text-sm text-ghostgrass mt-6 italic">
        Something beautiful is on its way.
      </p>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function CakeForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleMulti = (key: keyof FormData, value: string[]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFiles = (files: File[]) => {
    setData((prev) => ({ ...prev, inspirationImages: files }));
  };

  const next = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const prev = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const imageData = await Promise.all(
        data.inspirationImages.map(async (file) => {
          return new Promise<{ name: string; base64: string; type: string }>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = (reader.result as string).split(",")[1];
                resolve({ name: file.name, base64, type: file.type });
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }
          );
        })
      );

      const payload = {
        ...data,
        inspirationImages: imageData,
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong — please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong — please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg">
          <SuccessScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <header
        className="border-b bg-parchment/90 backdrop-blur-sm sticky top-0 z-10"
        style={{ borderColor: "rgba(196, 169, 122, 0.35)" }}
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="font-cinzel text-lg text-mossmoor tracking-wide">
            Barefoot Cakes & Makes
          </p>
          <p className="font-lora text-xs text-ashwood tracking-widest uppercase">
            {STEPS[step - 1].label}
          </p>
        </div>
      </header>

      {/* Hero — shown only on step 1 */}
      {step === 1 && (
        <div className="bg-mossmoor text-parchment py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="font-lora text-xs tracking-[0.3em] uppercase text-burrowdust mb-6 italic">
              Good food and warm hearths
            </p>
            <h1 className="font-cinzel text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-wide">
              Your Perfect
              <br />
              <em className="font-lora font-light not-italic text-morningmist">Custom Cake</em>
            </h1>
            <div className="w-12 h-px bg-burrowdust mb-6" />
            <p className="font-lora text-sm text-parchment/70 leading-relaxed max-w-md">
              Tell us a little about the cake you have in mind — we'd love to make something special for you. This takes about 5–7 minutes, and the more you share, the better.
            </p>
          </div>
        </div>
      )}

      {/* Form Body */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <ProgressBar step={step} />

        {step === 1 && (
          <StepAboutYou data={data} onChange={handleChange} />
        )}
        {step === 2 && (
          <StepTheEvent
            data={data}
            onChange={handleChange}
            onMulti={handleMulti}
          />
        )}
        {step === 3 && (
          <StepTheCake
            data={data}
            onChange={handleChange}
            onMulti={handleMulti}
          />
        )}
        {step === 4 && (
          <StepTheDesign
            data={data}
            onChange={handleChange}
            onMulti={handleMulti}
            onFiles={handleFiles}
          />
        )}
        {step === 5 && (
          <StepFinalDetails
            data={data}
            onChange={handleChange}
            onMulti={handleMulti}
          />
        )}

        {/* Error */}
        {error && (
          <div
            className="mt-6 p-4 border font-lora text-sm"
            style={{
              borderColor: "#A0522D",
              background: "rgba(160, 82, 45, 0.06)",
              color: "#A0522D",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {error}
          </div>
        )}

        {/* Navigation */}
        <div
          className="flex items-center justify-between mt-12 pt-8 border-t"
          style={{ borderColor: "rgba(196, 169, 122, 0.35)" }}
        >
          {step > 1 ? (
            <button type="button" onClick={prev} className="btn-secondary">
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length ? (
            <button type="button" onClick={next} className="btn-primary">
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "Sending..." : "Pass It Along 🌿"}
            </button>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center font-lora text-xs text-ghostgrass italic mt-10">
          Your information is never shared or sold. 🌿
        </p>
      </div>
    </div>
  );
}
