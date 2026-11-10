"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Star,
  UploadCloud,
  X,
} from "lucide-react";
import { uploadSuiteImage } from "@/lib/uploadImage";
import { createSuite, updateSuite } from "@/lib/suites";
import {
  createEmptySuiteInput,
  type Suite,
  type SuiteCategory,
  type SuiteInput,
} from "@/types/suite";

const CATEGORIES: SuiteCategory[] = [
  "Studio",
  "1-Bedroom",
  "2-Bedroom",
  "3-Bedroom",
  "Penthouse",
];

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20";

interface SuiteFormProps {
  /** Existing suite to edit. Omit to create a new record. */
  initialSuite?: Suite | null;
  onSaved?: (suite: Suite) => void;
  onCancel?: () => void;
}

function toInput(suite?: Suite | null): SuiteInput {
  if (!suite) return createEmptySuiteInput();

  return {
    name: suite.name,
    slug: suite.slug,
    tier: suite.tier,
    category: suite.category,
    description: suite.description,
    price: suite.price,
    guests: suite.guests,
    bathrooms: suite.bathrooms,
    squareFeet: suite.squareFeet,
    amenities: suite.amenities,
    houseRules: suite.houseRules,
    images: suite.images,
    isPublished: suite.isPublished,
  };
}

function parseList(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SuiteForm({
  initialSuite,
  onSaved,
  onCancel,
}: SuiteFormProps) {
  const [form, setForm] = useState<SuiteInput>(() => toInput(initialSuite));
  const [amenitiesText, setAmenitiesText] = useState(() =>
    (initialSuite?.amenities ?? []).join("\n")
  );
  const [houseRulesText, setHouseRulesText] = useState(() =>
    (initialSuite?.houseRules ?? []).join("\n")
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateField<K extends keyof SuiteInput>(
    key: K,
    value: SuiteInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setSuccessMessage(null);

    const results = await Promise.allSettled(
      files.map((file) => uploadSuiteImage(file))
    );

    const uploadedUrls: string[] = [];
    const failures: string[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        uploadedUrls.push(result.value);
      } else {
        const reason =
          result.reason instanceof Error
            ? result.reason.message
            : "Upload failed";
        failures.push(`${files[index].name}: ${reason}`);
      }
    });

    if (uploadedUrls.length > 0) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    }

    if (failures.length > 0) {
      setUploadError(failures.join(" "));
    }

    setIsUploading(false);
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!form.name.trim()) {
      setFormError("Suite name is required.");
      return;
    }

    const payload: SuiteInput = {
      ...form,
      name: form.name.trim(),
      tier: form.tier.trim(),
      slug: form.slug?.trim() || undefined,
      description: form.description.trim(),
      price: Number(form.price) || 0,
      guests: Number(form.guests) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      squareFeet: Number(form.squareFeet) || 0,
      amenities: parseList(amenitiesText),
      houseRules: parseList(houseRulesText),
      images: form.images,
    };

    setIsSaving(true);

    try {
      const saved = initialSuite
        ? await updateSuite(initialSuite.id, payload)
        : await createSuite(payload);

      setSuccessMessage(
        initialSuite
          ? `"${saved.name}" was updated successfully.`
          : `"${saved.name}" was created successfully.`
      );

      if (!initialSuite) {
        setForm(createEmptySuiteInput());
        setAmenitiesText("");
        setHouseRulesText("");
      }

      onSaved?.(saved);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the suite."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8"
    >
      <div>
        <h2 className="font-serif font-bold text-2xl text-navy">
          {initialSuite ? "Edit Suite" : "Add New Suite"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload gallery images to the public{" "}
          <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
            suite-images
          </span>{" "}
          bucket and save the resulting URLs to this suite.
        </p>
      </div>

      {/* Basic details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="suite-name" className="block text-sm font-medium text-navy mb-2">
            Suite Name <span className="text-red-500">*</span>
          </label>
          <input
            id="suite-name"
            type="text"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="e.g. Royal 1-Bedroom Suite"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="suite-tier" className="block text-sm font-medium text-navy mb-2">
            Tier
          </label>
          <input
            id="suite-tier"
            type="text"
            value={form.tier}
            onChange={(event) => updateField("tier", event.target.value)}
            placeholder="e.g. Deluxe Studio"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="suite-category" className="block text-sm font-medium text-navy mb-2">
            Category
          </label>
          <select
            id="suite-category"
            value={form.category}
            onChange={(event) =>
              updateField("category", event.target.value as SuiteCategory)
            }
            className={`${inputClass} cursor-pointer`}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="suite-price" className="block text-sm font-medium text-navy mb-2">
            Price per Night (₦)
          </label>
          <input
            id="suite-price"
            type="number"
            min={0}
            step={1000}
            value={form.price}
            onChange={(event) =>
              updateField("price", Number(event.target.value))
            }
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="suite-guests" className="block text-sm font-medium text-navy mb-2">
            Max Guests
          </label>
          <input
            id="suite-guests"
            type="number"
            min={1}
            value={form.guests}
            onChange={(event) =>
              updateField("guests", Number(event.target.value))
            }
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="suite-bathrooms" className="block text-sm font-medium text-navy mb-2">
            Bathrooms
          </label>
          <input
            id="suite-bathrooms"
            type="number"
            min={0}
            value={form.bathrooms}
            onChange={(event) =>
              updateField("bathrooms", Number(event.target.value))
            }
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="suite-square-feet" className="block text-sm font-medium text-navy mb-2">
            Square Feet
          </label>
          <input
            id="suite-square-feet"
            type="number"
            min={0}
            value={form.squareFeet}
            onChange={(event) =>
              updateField("squareFeet", Number(event.target.value))
            }
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="suite-description" className="block text-sm font-medium text-navy mb-2">
            Description
          </label>
          <textarea
            id="suite-description"
            rows={4}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe the suite experience…"
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="suite-amenities" className="block text-sm font-medium text-navy mb-2">
            Amenities
          </label>
          <textarea
            id="suite-amenities"
            rows={5}
            value={amenitiesText}
            onChange={(event) => setAmenitiesText(event.target.value)}
            placeholder={"24/7 Power\nHigh-Speed WiFi\nAir Conditioning"}
            className={`${inputClass} resize-y`}
          />
          <p className="text-xs text-gray-400 mt-1">
            One per line, or separated by commas.
          </p>
        </div>

        <div>
          <label htmlFor="suite-house-rules" className="block text-sm font-medium text-navy mb-2">
            House Rules
          </label>
          <textarea
            id="suite-house-rules"
            rows={5}
            value={houseRulesText}
            onChange={(event) => setHouseRulesText(event.target.value)}
            placeholder={"Check-in: 3:00 PM\nNo smoking\nNo pets"}
            className={`${inputClass} resize-y`}
          />
          <p className="text-xs text-gray-400 mt-1">
            One per line, or separated by commas.
          </p>
        </div>
      </div>

      {/* Image uploader */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-navy">Gallery Images</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              The first image is used as the cover photo.
            </p>
          </div>
          <span className="text-xs font-medium text-gray-500">
            {form.images.length} image{form.images.length === 1 ? "" : "s"}
          </span>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label="Upload suite images"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            void handleFiles(event.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-gold bg-gold/5"
              : "border-gray-300 bg-gray-50/60 hover:border-gold/60 hover:bg-gold/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files) {
                void handleFiles(event.target.files);
              }
              event.target.value = "";
            }}
          />

          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <p className="text-sm font-medium text-navy">Uploading images…</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy">
                  Drag &amp; drop images here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or click to browse. JPG, PNG, WebP, AVIF or GIF — up to 10 MB each.
                </p>
              </div>
            </>
          )}
        </div>

        {uploadError && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{uploadError}</p>
          </div>
        )}

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {form.images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
              >
                <Image
                  src={url}
                  alt={`Suite image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />

                {index === 0 && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    <Star className="w-3 h-3" />
                    Cover
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-opacity hover:bg-red-600 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.isPublished ?? true}
          onChange={(event) =>
            updateField("isPublished", event.target.checked)
          }
          className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
        />
        <span className="text-sm text-navy">
          Publish this suite on the website
        </span>
      </label>

      {/* Feedback */}
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-gray-300 text-navy text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold text-white text-sm font-semibold shadow-lg hover:bg-[#C5A028] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {initialSuite ? "Update Suite" : "Save Suite"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
