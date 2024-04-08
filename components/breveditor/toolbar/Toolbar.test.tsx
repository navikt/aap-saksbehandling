import { Toolbar } from 'components/breveditor/toolbar/Toolbar';
import { render, screen } from '@testing-library/react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

const ToolbarWrapper = () => {
  const editor = useEditor({ extensions: [StarterKit] });
  return <Toolbar editor={editor} />;
};
describe('Toolbar', () => {
  beforeEach(() => {
    render(<ToolbarWrapper />);
  });
  test('har knapp for å angre', async () => {
    const button = await screen.findByRole('button', { name: 'Angre' });
    expect(button).toBeVisible();
  });
  test('har knapp for H1', async () => {
    const heading = await screen.findByRole('button', { name: 'H1' });
    expect(heading).toBeVisible();
  });

  test('har knapp for H2', async () => {
    const heading = await screen.findByRole('button', { name: 'H2' });
    expect(heading).toBeVisible();
  });

  test('har knapp for H3', async () => {
    const heading = await screen.findByRole('button', { name: 'H3' });
    expect(heading).toBeVisible();
  });

  test('har knapp for H4', async () => {
    const heading = await screen.findByRole('button', { name: 'H4' });
    expect(heading).toBeVisible();
  });

  test('har knapp for bold', async () => {
    const button = await screen.findByRole('button', { name: 'B' });
    expect(button).toBeVisible();
  });

  test('har knapp for kursiv', async () => {
    const button = await screen.findByRole('button', { name: 'I' });
    expect(button).toBeVisible();
  });

  test('har knapp for punktliste', async () => {
    const button = await screen.findByRole('button', { name: 'Punktliste' });
    expect(button).toBeVisible();
  });

  test('har knapp for nummerert liste', async () => {
    const button = await screen.findByRole('button', { name: 'Nummerert liste' });
    expect(button).toBeVisible();
  });

  test('har knapp for å sette inn tabell', async () => {
    const button = await screen.findByRole('button', { name: 'Sett inn tabell' });
    expect(button).toBeVisible();
  });
});
