"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Building2,
  Images,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import SuiteForm from "@/components/admin/SuiteForm";
import { deleteSuite, getSuites } from "@/lib/suites";
import type { Suite } from "@/types/suite";

export default function AdminSuitesPage() {
  const [suites, setSuites] = useState<Suite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSuite, setEditingSuite] = useState<Suite | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSuites = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getSuites();
      setSuites(data);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load suites."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSuites();
  }, [loadSuites]);

  function openCreateForm() {
    setEditingSuite(null);
    setIsFormOpen(true);
  }

  function openEditForm(suite: Suite) {
    setEditingSuite(suite);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingSuite(null);
  }

  async function handleDelete(suite: Suite) {
    const confirmed = window.confirm(
      `Delete "${suite.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(suite.id);
    setLoadError(null);

    try {
      await deleteSuite(suite.id);
      setSuites((prev) => prev.filter((item) => item.id !== suite.id));
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to delete suite."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">
            Suite Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create suites, manage details, and upload gallery images.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold text-white text-sm font-semibold shadow-lg hover:bg-[#C5A028] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Suite
          </button>
        )}
      </div>

      {loadError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {isFormOpen && (
        <SuiteForm
          key={editingSuite?.id ?? "new-suite"}
          initialSuite={editingSuite}
          onSaved={() => {
            closeForm();
            void loadSuites();
          }}
          onCancel={closeForm}
        />
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-navy">
            Suites ({suites.length})
          </h2>
          {isFormOpen && (
            <button
              type="button"
              onClick={closeForm}
              className="text-sm text-gold font-medium hover:underline"
            >
              Back to list
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading suites…</span>
          </div>
        ) : suites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy">
              No suites yet
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              Add your first suite to start building the gallery and
              availability catalogue.
            </p>
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-white text-sm font-semibold hover:bg-[#C5A028] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Suite
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {suites.map((suite) => (
              <li
                key={suite.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 hover:bg-gray-50/60 transition-colors"
              >
                <div className="relative w-full sm:w-28 h-40 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {suite.images[0] ? (
                    <Image
                      src={suite.images[0]}
                      alt={suite.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Images className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-navy truncate">
                      {suite.name}
                    </h3>
                    {!suite.isPublished && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase tracking-wide">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {suite.category} · ₦{suite.price.toLocaleString()} / night ·{" "}
                    {suite.guests} guests
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {suite.images.length} image
                    {suite.images.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditForm(suite)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-navy hover:bg-navy hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(suite)}
                    disabled={deletingId === suite.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-60 transition-colors"
                  >
                    {deletingId === suite.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
