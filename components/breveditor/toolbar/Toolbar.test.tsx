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
  test('har knapp for å angre', () => {
    expect(screen.getByRole('button', { name: 'Angre' })).toBeVisible();
  });
  test('har knapp for H1', () => {
    expect(screen.getByRole('button', { name: 'H1' })).toBeVisible();
  });

  test('har knapp for H2', () => {
    expect(screen.getByRole('button', { name: 'H2' })).toBeVisible();
  });

  test('har knapp for H3', () => {
    expect(screen.getByRole('button', { name: 'H3' })).toBeVisible();
  });

  test('har knapp for H4', () => {
    expect(screen.getByRole('button', { name: 'H4' })).toBeVisible();
  });

  test('har knapp for bold', () => {
    expect(screen.getByRole('button', { name: 'B' })).toBeVisible();
  });

  test('har knapp for kursiv', () => {
    expect(screen.getByRole('button', { name: 'I' })).toBeVisible();
  });

  test('har knapp for punktliste', () => {
    expect(screen.getByRole('button', { name: 'Punktliste' })).toBeVisible();
  });

  test('har knapp for nummerert liste', () => {
    expect(screen.getByRole('button', { name: 'Nummerert liste' })).toBeVisible();
  });

  test('har knapp for å sette inn tabell', () => {
    expect(screen.getByRole('button', { name: 'Sett inn tabell' })).toBeVisible();
  });
});
