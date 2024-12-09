import {Button, type ButtonProps} from './Button.tsx';

export function ButtonTest() {
  const handleTest: ButtonProps['onClick'] = ({currentTarget}) => {
    const isPressed = currentTarget.getAttribute('aria-pressed') === 'true';

    if (isPressed) {
      currentTarget.removeAttribute('aria-pressed');
      currentTarget.setAttribute('disabled', 'true');
    } else {
      currentTarget.setAttribute('aria-pressed', 'true');
    }
  };

  return (
    <div style={{display: 'grid', gap: '10px', justifyItems: 'center'}}>
      <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'column'}}>
        <Button label="Secondary" onClick={handleTest} />
        <Button label="Secondary" loading onClick={handleTest} />
        <Button label="Secondary" outline onClick={handleTest} />
        <Button label="Secondary" loading outline onClick={handleTest} />
      </div>

      <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'column'}}>
        <Button
          label="Primary"
          variant="primary"
          size="medium"
          onClick={handleTest}
        />
        <Button
          label="Primary"
          variant="primary"
          size="medium"
          loading
          onClick={handleTest}
        />
        <Button
          label="Primary"
          variant="primary"
          size="medium"
          outline
          onClick={handleTest}
        />
        <Button
          label="Primary"
          variant="primary"
          size="medium"
          loading
          outline
          onClick={handleTest}
        />
      </div>

      <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'column'}}>
        <Button
          label="Tertiary"
          variant="tertiary"
          size="large"
          onClick={handleTest}
        />
        <Button
          label="Tertiary"
          variant="tertiary"
          size="large"
          loading
          onClick={handleTest}
        />
        <Button
          label="Tertiary"
          variant="tertiary"
          size="large"
          outline
          onClick={handleTest}
        />
        <Button
          label="Tertiary"
          variant="tertiary"
          size="large"
          loading
          outline
          onClick={handleTest}
        />
      </div>

      <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'column'}}>
        <Button
          label="Foreground"
          variant="foreground"
          size="small"
          onClick={handleTest}
        />
        <Button
          label="Foreground"
          variant="foreground"
          size="small"
          loading
          onClick={handleTest}
        />
        <Button
          label="Foreground"
          variant="foreground"
          size="small"
          outline
          onClick={handleTest}
        />
        <Button
          label="Foreground"
          variant="foreground"
          size="small"
          loading
          outline
          onClick={handleTest}
        />
      </div>

      <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'column'}}>
        <Button
          label="Background"
          variant="background"
          size="medium"
          onClick={handleTest}
        />
        <Button
          label="Background"
          variant="background"
          size="medium"
          loading
          onClick={handleTest}
        />
        <Button
          label="Background"
          variant="background"
          size="medium"
          outline
          onClick={handleTest}
        />
        <Button
          label="Background"
          variant="background"
          size="medium"
          loading
          outline
          onClick={handleTest}
        />
      </div>

      <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'column'}}>
        <Button
          label="Danger"
          variant="danger"
          size="large"
          onClick={handleTest}
        />
        <Button
          label="Danger"
          variant="danger"
          size="large"
          loading
          onClick={handleTest}
        />
        <Button
          label="Danger"
          variant="danger"
          size="large"
          outline
          onClick={handleTest}
        />
        <Button
          label="Danger"
          variant="danger"
          size="large"
          loading
          outline
          onClick={handleTest}
        />
      </div>
    </div>
  );
}
