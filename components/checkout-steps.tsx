"use client";

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 1, label: "Address" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Confirmation" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                step.id === currentStep
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2"
                  : step.id < currentStep
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {step.id}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                step.id === currentStep
                  ? "text-indigo-600"
                  : step.id < currentStep
                    ? "text-indigo-600"
                    : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 ${
                step.id < currentStep ? "bg-indigo-600" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}