import {Text} from '@src/components/ui/Text/Text.tsx';

export interface MaxStackText {
  maxReached?: boolean;
}

export function MaxStackText({maxReached = false}: MaxStackText) {
  const maxLabel = maxReached
    ? 'Max stack size reached!'
    : 'Stack max has not yet been reached…';

  return (
    <Text size="small" variant={maxReached ? 'danger' : 'normal'}>
      <strong>{maxLabel}</strong>
    </Text>
  );
}
