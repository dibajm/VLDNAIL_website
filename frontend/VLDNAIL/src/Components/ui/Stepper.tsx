type Step = {
  label: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
};

function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step.label} className="flex flex-1 items-center">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  isCompleted || isActive
                    ? "bg-[#D37E90] text-white"
                    : "bg-[#F5DDE1] text-[#D37E90]"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>

              <span
                className={`hidden text-xs font-medium md:block ${
                  isActive ? "text-[#D37E90]" : "text-[#7c6269]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-[#F5DDE1]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;