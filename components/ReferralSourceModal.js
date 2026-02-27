import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { clientFirestore } from "@/lib/firebaseClient";
import { IoClose } from "react-icons/io5";
import { usePostHog } from "posthog-js/react";

const REFERRAL_OPTIONS = [
  { value: "reddit", label: "Reddit" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "referral", label: "Referral from a friend or colleague" },
  { value: "ai-informed", label: "AI assistant (like ChatGPT)" },
  { value: "other", label: "Other" },
];

export default function ReferralSourceModal() {
  const { user, isVerifiedUser, userData, loadingUserData } = useAuth();
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");
  const [saving, setSaving] = useState(false);
  const posthog = usePostHog();

  // Show modal only if user is verified and doesn't have referralSource
  const shouldShow =
    isVerifiedUser &&
    !loadingUserData &&
    userData !== undefined &&
    !userData?.referralSource;

  const saveReferralSource = async (value) => {
    setSaving(true);
    try {
      await setDoc(
        doc(clientFirestore, `users/${user.uid}`),
        { referralSource: value },
        { merge: true }
      );

      // Track in PostHog
      posthog.capture("referral_source_submitted", { referralSource: value });
      posthog.people.set({ referral_source_for_hamed_cutie_pie: value });
    } catch (err) {
      console.error("Failed to save referral source:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const referralSource =
      selected === "other" ? `other: ${otherText}` : selected;
    await saveReferralSource(referralSource);
  };

  const handleDismiss = () => {
    saveReferralSource("declined");
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-2 right-2 z-[9999] w-[320px] bg-neutral-200 rounded-xl shadow-lg border border-neutral-600">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="font-medium text-sm text-gray-900">Where did you hear about us?</h3>
        <button
          onClick={handleDismiss}
          disabled={saving}
          className="p-1 rounded-full border border-gray-400 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-500 disabled:opacity-50"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Options */}
      <form onSubmit={handleSubmit} className="px-4 pb-4">
        <div className="space-y-2">
          {REFERRAL_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-md bg-white border ${
                selected === option.value
                  ? "border-neutral-800"
                  : "border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="referralSource"
                value={option.value}
                checked={selected === option.value}
                onChange={(e) => setSelected(e.target.value)}
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-xs text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>

        {selected === "other" && (
          <input
            type="text"
            placeholder="Please specify..."
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            className="mt-3 block w-full rounded-lg border border-neutral-400 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-600 outline-none bg-white"
            required
          />
        )}

        <button
          type="submit"
          disabled={!selected || (selected === "other" && !otherText) || saving}
          className="mt-4 w-full rounded-lg bg-neutral-800 disabled:bg-neutral-600 py-2.5 text-center text-white text-[14px] font-medium"
        >
          {saving ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
