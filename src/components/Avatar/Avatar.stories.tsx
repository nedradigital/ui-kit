import React from 'react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Avatar } from './Avatar';

const defaultKnobs = () => ({
  url: text('url', 'https://pbs.twimg.com/profile_images/1150453787603156992/DoiKLDMY_400x400.png'),
  size: select('size', ['s', 'm'], 'm'),
  form: select('form', ['round', 'brick', 'default'], 'round'),
});

storiesOf('Avatar', module)
  .addDecorator(withKnobs)
  .add('Avatar', () => (
    <Avatar as="div" style={{ color: '#000' }} form="round" {...defaultKnobs()} />
  ));
