import './Stepper.stories.css';

import React from 'react';
import { select } from '@storybook/addon-knobs';

import { IconBackward } from '../../../icons/IconBackward/IconBackward';
import { IconForward } from '../../../icons/IconForward/IconForward';
import { cn } from '../../../utils/bem';
import { createMetadata } from '../../../utils/storybook';
import { BasicSelect } from '../../BasicSelect';
import { Button } from '../../Button/Button';
import { Text } from '../../Text/Text';
import { Stepper, stepperDefaultSize, stepperSizes } from '../Stepper';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import mdx from './Stepper.mdx';

const cnStepperStories = cn('StepperStories');

const defaultKnobs = () => ({
  size: select('size', stepperSizes, stepperDefaultSize),
});

type Item = {
  label: string;
};

const items: Item[] = [
  {
    label: 'Главное',
  },
  {
    label: 'Важное',
  },
  {
    label: 'Необязательное',
  },
];

const getStepContent = (stepNumber: number) => {
  switch (stepNumber) {
    case 0:
      return (
        <>
          <Text view="primary">Содержимое первого шага</Text>
          <BasicSelect
            className={cnStepperStories('Select')}
            id="select"
            placeholder="Список"
            options={['1', 'вторая опция', '3', 'e']}
            getOptionLabel={(o) => o}
          />
        </>
      );
    case 1:
      return (
        <>
          <Text view="primary">Содержимое второго шага</Text>
        </>
      );
    case 2:
      return <Text view="brand">Содержимое шага № 3</Text>;
    default:
      return `unknown ${stepNumber} step`;
  }
};

export function Playground() {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [skippedSteps, setSkippedSteps] = React.useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());

  const { size } = defaultKnobs();

  const getStepIndex = (step: Item | null): number =>
    items.findIndex((item) => step && item.label === step.label);

  const getSkipped = (step: Item): boolean => skippedSteps.has(getStepIndex(step));
  const getCompleted = (step: Item): boolean => completedSteps.has(getStepIndex(step));
  const getDisabled = (step: Item): boolean =>
    getStepIndex(step) >= 2 && skippedSteps.size === 0 && completedSteps.size === 0;
  const handleNext = () => {
    if (activeStep < items.length - 1) {
      const newCompleted = new Set(completedSteps);
      newCompleted.add(activeStep);
      setCompletedSteps(newCompleted);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handlePrev = () => {
    if (activeStep > 0) {
      if (completedSteps.has(activeStep)) {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      } else {
        const newSkipped = new Set(skippedSteps);
        newSkipped.add(activeStep);
        setSkippedSteps(newSkipped);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      }
    }
  };
  const handleReset = () => {
    setSkippedSteps(new Set());
    setCompletedSteps(new Set());
    setActiveStep(0);
  };
  const handleChange = ({ value }: { value: Item | null }) => {
    if (completedSteps.has(activeStep)) {
      setActiveStep(getStepIndex(value));
    } else {
      const newSkipped = new Set(skippedSteps);
      newSkipped.add(activeStep);
      setSkippedSteps(newSkipped);
      setActiveStep(getStepIndex(value));
    }
  };

  const handleSkip = () => {
    const newSkipped = new Set(skippedSteps);
    newSkipped.add(activeStep);
    setSkippedSteps(newSkipped);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div className={cnStepperStories()}>
      <Stepper
        items={items}
        getLabel={(item) => item.label}
        value={items[activeStep]}
        onChange={handleChange}
        getCompleted={getCompleted}
        getSkipped={getSkipped}
        getDisabled={getDisabled}
        size={size}
      />
      <div className={cnStepperStories('Content')}>{getStepContent(activeStep)}</div>
      <div className={cnStepperStories('Actions')}>
        <Button
          onClick={handlePrev}
          label="Назад"
          iconLeft={IconBackward}
          view="ghost"
          disabled={activeStep === 0}
        />
        <div>
          {(skippedSteps.size > 0 || completedSteps.size > 0) && (
            <Button
              className={cnStepperStories('ResetButton')}
              onClick={handleReset}
              label="Отменить"
              view="ghost"
            />
          )}
          {activeStep === 1 ? (
            <Button onClick={handleSkip} label="Заполнить позже" />
          ) : (
            <Button onClick={handleNext} label="Дальше" iconRight={IconForward} />
          )}
        </div>
      </div>
    </div>
  );
}

export default createMetadata({
  title: 'Компоненты|/Stepper',
  parameters: {
    docs: {
      page: mdx,
    },
  },
});
