import {StackList, type StackItemProps} from './StackList.tsx';

export interface StackListAutoProps {
  items?: StackItemProps['label'][];
}

export function StackListAuto({items = []}: StackListAutoProps) {
  const stackItems = items.length ? (
    items.map((item) => <StackList.Item key={item} label={item} />)
  ) : (
    <StackList.Item label="Queue is empty" empty />
  );

  return <StackList>{stackItems}</StackList>;
}
