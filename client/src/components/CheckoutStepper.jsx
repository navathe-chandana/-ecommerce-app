const CheckoutStepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="stepper">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;
        return (
          <div key={label} className="stepper-item">
            <div
              className={`stepper-circle ${isActive ? "stepper-active" : ""} ${isDone ? "stepper-done" : ""}`}
              onClick={() => isDone && onStepClick(stepNum)}
            >
              {isDone ? "✓" : stepNum}
            </div>
            <span className={`stepper-label ${isActive ? "stepper-label-active" : ""}`}>{label}</span>
            {stepNum !== steps.length && <div className={`stepper-line ${isDone ? "stepper-line-done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;