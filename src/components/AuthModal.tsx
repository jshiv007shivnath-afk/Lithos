import { useState, FormEvent } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldAlert } from 'lucide-react';
import { User } from '../types';
import { auth, db, doc, getDoc, setDoc } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sandboxProvider, setSandboxProvider] = useState<'Google' | 'GitHub' | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        const newUser: User = {
          uid: fbUser.uid,
          email: email.toLowerCase(),
          displayName: displayName || email.split('@')[0],
          enrolledCourses: [],
          savedSites: [],
          balance: 100, // Give them 100 default credits
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', fbUser.uid), newUser);
        onAuthSuccess(newUser);
        onClose();
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        const userDocRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          onAuthSuccess(userSnap.data() as User);
        } else {
          const fallbackUser: User = {
            uid: fbUser.uid,
            email: fbUser.email || email.toLowerCase(),
            displayName: fbUser.displayName || email.split('@')[0],
            enrolledCourses: [],
            savedSites: [],
            balance: 100,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, fallbackUser);
          onAuthSuccess(fallbackUser);
        }
        onClose();
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Feel free to register a new account.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'An error occurred during authentication. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxBypass = async (provider: 'Google' | 'GitHub') => {
    setError('');
    setLoading(true);
    try {
      const sandboxUid = `sandbox_${provider.toLowerCase()}_user`;
      const userDocRef = doc(db, 'users', sandboxUid);
      const userSnap = await getDoc(userDocRef);

      let sandboxUser: User;
      if (userSnap.exists()) {
        sandboxUser = userSnap.data() as User;
      } else {
        sandboxUser = {
          uid: sandboxUid,
          email: `sandbox.${provider.toLowerCase()}@lithos.org`,
          displayName: `Sandbox ${provider} Explorer`,
          enrolledCourses: [],
          savedSites: [],
          balance: 100,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, sandboxUser);
      }
      onAuthSuccess(sandboxUser);
      onClose();
    } catch (err: any) {
      console.error('Sandbox login error:', err);
      setError('Could not establish a sandbox connection. Please sign up with email/password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'Google' | 'GitHub') => {
    setError('');
    setLoading(true);
    setSandboxProvider(null);

    try {
      const provider = providerName === 'Google' 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();

      const userCredential = await signInWithPopup(auth, provider);
      const fbUser = userCredential.user;

      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        onAuthSuccess(userSnap.data() as User);
      } else {
        const newUser: User = {
          uid: fbUser.uid,
          email: fbUser.email || `explorer.${providerName.toLowerCase()}@lithos.org`,
          displayName: fbUser.displayName || `${providerName} Explorer`,
          enrolledCourses: [],
          savedSites: [],
          balance: 100,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUser);
        onAuthSuccess(newUser);
      }
      onClose();
    } catch (err: any) {
      console.error(`${providerName} OAuth Error:`, err);
      setSandboxProvider(providerName);
      if (err.code === 'auth/popup-blocked') {
        setError('Login popup was blocked by your browser. Please enable popups for this site.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login popup closed before completion. Please try again.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address but a different login method.');
      } else {
        setError(`Failed to sign in with ${providerName}. Setup requires custom Developer App API Keys enabled inside the Firebase Console. Click the sandbox bypass button below to test instantly as a sandbox member!`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#111111] border border-white/10 text-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Auth Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Headings */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 256 256">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="text-xl font-playfair italic">Lithos Accounts</span>
          </div>
          <p className="text-sm text-white/60">
            {isRegistering 
              ? 'Join a network of geologists exploring deep-time mysteries.' 
              : 'Log in to sync your geology notebooks, courses, and tours.'}
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-2 bg-red-950/50 border border-red-800/60 rounded-xl p-3 text-xs text-red-200">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {sandboxProvider && (
              <button
                type="button"
                onClick={() => handleSandboxBypass(sandboxProvider)}
                className="w-full bg-[#e8702a]/10 hover:bg-[#e8702a]/20 border border-[#e8702a]/30 text-[#e8702a] rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                <span>✨ Continue with Sandbox {sandboxProvider} Account</span>
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 pointer-events-none">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Holmes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-white/30 focus:border-[#e8702a] focus:ring-1 focus:ring-[#e8702a] focus:outline-none transition-all text-white"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8702a] hover:bg-[#d2611f] disabled:bg-white/10 disabled:text-white/40 text-white font-medium text-sm py-3 rounded-xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : isRegistering ? (
              'Create Geology Account'
            ) : (
              'Authorize and Log In'
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#111111] px-2 text-white/40">Or continue with</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 rounded-xl py-2.5 px-4 text-xs font-medium transition-all text-white/90 hover:text-white cursor-pointer"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialLogin('GitHub')}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 rounded-xl py-2.5 px-4 text-xs font-medium transition-all text-white/90 hover:text-white cursor-pointer"
          >
            <svg className="w-4 h-4 fill-white text-transparent" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer Toggle */}
        <div className="mt-6 text-center text-xs text-white/50">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-[#e8702a] hover:underline font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Lithos?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-[#e8702a] hover:underline font-semibold cursor-pointer"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
