import { clientAuth as auth } from "@/lib/firebaseClient";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import AnimatedShimmerText from "./AnimatedShimmerText";
import Link from "next/link";
import { FaFacebook, FaGithub } from "react-icons/fa";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [failedCount, setFailedCount] = useState(0); // consecutive wrong‑password attempts
  const [showReset, setShowReset] = useState(false);

  // ────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────
  const clearMessages = () => {
    setError(null);
    setInfo(null);
  };

  const handleProviderSignIn = async (provider) => {
    clearMessages();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        // Do nothing
        setError(null);
      } else if (err.code === "auth/account-exists-with-different-credential") {
        // Merge accounts: try to sign in with the existing provider, then link
        const pendingCred = err.credential;
        const email = err.customData?.email;
        if (email) {
          try {
            // Find the sign-in methods for this email
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods && methods.length > 0) {
              let existingProvider;
              if (methods.includes("google.com")) {
                existingProvider = new GoogleAuthProvider();
              } else if (methods.includes("github.com")) {
                existingProvider = new GithubAuthProvider();
              } else if (methods.includes("microsoft.com")) {
                existingProvider = new OAuthProvider("microsoft.com");
              }
              if (existingProvider) {
                // Sign in with the existing provider
                const result = await signInWithPopup(auth, existingProvider);
                // Link the pending credential
                if (pendingCred) {
                  await result.user.linkWithCredential(pendingCred);
                }
              } else {
                setError("Please try again with email and password: " + email);
              }
            } else {
              setError(
                "Unable to merge accounts. Please try again with email and password."
              );
            }
          } catch (mergeErr) {
            setError(
              "An error occurred while merging accounts. Please try again with email and password."
            );
          }
        } else {
          setError(
            "Unable to find email address. Please try again with email and password."
          );
        }
      } else {
        setError(
          "Unable to log in or sign up. Please try again with email and password. Error: " +
            err.code || "UNKNOWN"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerPasswordSetEmail = async () => {
    clearMessages();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://hiring.cafe/auth",
        handleCodeInApp: false,
      });
      setInfo(
        "We just sent you a secure link to set your password. Check your inbox and follow the steps."
      );
      setShowReset(false);
      setFailedCount(0);
    } catch (_) {
      setError(
        `We couldn't send the password reset email. Please try again in a minute.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      // ──────────────── TRY SIGN‑IN FIRST ────────────────
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        await sendEmailVerification(user, {
          url: "https://hiring.cafe/auth",
          handleCodeInApp: false,
        });
        await signOut(auth);
        setError(
          "Please verify your e‑mail address first. We just sent you a fresh link."
        );
      }
      // success ⇒ reset counters
      setFailedCount(0);
      setShowReset(false);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        // ──────────────── NO ACCOUNT → CREATE ONE ────────────────
        try {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await sendEmailVerification(user, {
            url: "https://hiring.cafe/auth",
            handleCodeInApp: false,
          });
          await signOut(auth);
          setInfo(
            "We've sent a verification link. Confirm it and then come back to log in."
          );
          setFailedCount(0);
          setShowReset(false);
        } catch (createErr) {
          if (createErr.code === "auth/weak-password") {
            setError("Choose a stronger password (minimum 6 characters).");
          } else if (createErr.code === "auth/email-already-in-use") {
            // Email belongs to a provider‑only account. Offer password setup.
            await triggerPasswordSetEmail();
          } else {
            setError("Something went wrong. Please try again.");
          }
        }
      } else if (err.code === "auth/wrong-password") {
        // Might be provider‑only account OR wrong password.
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods && methods.length && !methods.includes("password")) {
            // provider‑only → send password‑reset link immediately
            await triggerPasswordSetEmail();
          } else {
            // increment failed counter and maybe reveal reset‑password option
            const attempts = failedCount + 1;
            setFailedCount(attempts);
            if (attempts >= 1) {
              setShowReset(true);
            }
            setError("Incorrect password. Please try again.");
          }
        } catch (_) {
          setError("Incorrect password. Please try again.");
        }
      } else if (err.code === "auth/invalid-email") {
        setError("That doesn't look like a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full space-y-6">
      <span className="text-2xl font-medium text-gray-900">
        {loading ? <AnimatedShimmerText /> : "Welcome to HiringCafe"}
      </span>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-600">
          {info}
        </p>
      )}

      {showReset && (
        <button
          type="button"
          onClick={triggerPasswordSetEmail}
          className="self-start text-sm font-medium text-blue-600 underline"
          disabled={loading}
        >
          Forgot your password? Reset it
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block font-medium w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black outline-black focus:ring-0"
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full font-medium rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black outline-black focus:ring-0"
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 py-3 text-center text-white font-semibold disabled:opacity-60"
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      </form>

      <span className="mt-4 text-xs">
        By creating an account or logging in, you understand and agree to
        HiringCafe{" "}
        <Link
          href="/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Terms and Conditions
        </Link>
        . You also acknowledge our{" "}
        <Link
          href="private-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Cookie and Privacy Policies
        </Link>
        .
      </span>

      {/* Separator */}
      <div className="flex items-center gap-4">
        <hr className="flex-grow border-gray-300" />
        <span className="text-sm text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* OAuth providers */}
      <div className="space-y-3">
        <ProviderButton
          icon={
            <span className="flex items-center justify-center w-8 h-8">
              {/* Google logo */}
              <svg width="20" height="20" viewBox="0 0 20 20">
                <g>
                  <path
                    d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.48a4.69 4.69 0 0 1-2.03 3.07v2.55h3.28c1.92-1.77 3.03-4.38 3.03-7.41z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 20c2.7 0 4.97-.9 6.63-2.44l-3.28-2.55c-.91.61-2.07.97-3.35.97-2.57 0-4.75-1.74-5.53-4.07H1.09v2.56A9.99 9.99 0 0 0 10 20z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.47 11.91A5.99 5.99 0 0 1 4.1 10c0-.66.11-1.3.18-1.91V5.53H1.09A9.99 9.99 0 0 0 0 10c0 1.64.39 3.19 1.09 4.47l3.38-2.56z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 4.01c1.47 0 2.78.51 3.81 1.51l2.85-2.85C14.97 1.09 12.7 0 10 0A9.99 9.99 0 0 0 1.09 5.53l3.38 2.56C5.25 5.75 7.43 4.01 10 4.01z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
            </span>
          }
          label="Continue with Google"
          onClick={() => handleProviderSignIn(new GoogleAuthProvider())}
          disabled={loading}
        />
        <ProviderButton
          icon={
            <span className="flex items-center justify-center w-8 h-8">
              {/* Microsoft logo */}
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="1" y="1" width="8" height="8" fill="#F25022" />
                <rect x="11" y="1" width="8" height="8" fill="#7FBA00" />
                <rect x="1" y="11" width="8" height="8" fill="#00A4EF" />
                <rect x="11" y="11" width="8" height="8" fill="#FFB900" />
              </svg>
            </span>
          }
          label="Continue with Microsoft"
          onClick={() =>
            handleProviderSignIn(new OAuthProvider("microsoft.com"))
          }
          disabled={loading}
        />
        <ProviderButton
          icon={<FaFacebook className="text-blue-600" />}
          label="Continue with Facebook"
          onClick={() => handleProviderSignIn(new FacebookAuthProvider())}
          disabled={loading}
        />
        <ProviderButton
          icon={<FaGithub />}
          label="Continue with GitHub"
          onClick={() => handleProviderSignIn(new GithubAuthProvider())}
          disabled={loading}
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Provider button sub‑component
// ────────────────────────────────────────────────────────────────────────────────
function ProviderButton({ icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 hover:bg-gray-50 disabled:opacity-60"
    >
      <span className="flex items-center justify-center w-8 h-8">{icon}</span>
      <span className="flex-1 text-sm font-medium text-center">{label}</span>
    </button>
  );
}
