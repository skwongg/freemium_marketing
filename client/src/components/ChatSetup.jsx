// src/components/ChatSetup.jsx
import { useState } from 'react';

const steps = [
  {
    id: 'topic',
    title: 'Choose a company',
    question: 'What company do you want to market to??',
    placeholder: 'Enter a domain'
  },
  {
    id: 'mode',
    title: 'Select Mode',
    question: 'How would you like to chat?',
    options: ['Casual', 'Professional', 'Technical']
  }
];

function ChatSetup({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState({
    topic: '',
    mode: 'Casual'
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      onComplete(inputs);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 flex-1 mx-1 rounded ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {steps[currentStep].title}
          </h2>
        </div>

        <div className="space-y-4">
          {steps[currentStep].options ? (
            <div className="space-y-2">
              {steps[currentStep].options.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setInputs(prev => ({ ...prev, [steps[currentStep].id]: option }));
                    handleNext();
                  }}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    inputs[steps[currentStep].id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {steps[currentStep].question}
                </label>
                <input
                  type="text"
                  value={inputs[steps[currentStep].id]}
                  onChange={e =>
                    setInputs(prev => ({
                      ...prev,
                      [steps[currentStep].id]: e.target.value
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={steps[currentStep].placeholder}
                />
              </div>
              <button
                type="submit"
                disabled={!inputs[steps[currentStep].id]}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {currentStep === steps.length - 1 ? 'Start Chat' : 'Next'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatSetup;
