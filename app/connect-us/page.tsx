import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function ConnectUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Customer Service</h1>
        <p className="mt-3 text-sm text-slate-600">
          Choose how you’d like to get in touch with us.
        </p>

        <div className="mt-8 space-y-4">
          <a
            href="mailto:mahmoud.tawfeek99@gmail.com"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-500 hover:bg-indigo-50"
          >
            <div className="rounded-full bg-indigo-100 p-2 text-indigo-700">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Email us</p>
              <p className="text-sm text-slate-600">mahmoud.tawfeek99@gmail.com</p>
            </div>
          </a>

          <a
            href="tel:+201551789982"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-500 hover:bg-indigo-50"
          >
            <div className="rounded-full bg-indigo-100 p-2 text-indigo-700">
              <Phone size={18} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Call us</p>
              <p className="text-sm text-slate-600">+20 155 178 9982</p>
            </div>
          </a>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
