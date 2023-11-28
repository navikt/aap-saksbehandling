import { Toolbar } from 'components/breveditor/toolbar/Toolbar';
import { render, screen } from '@testing-library/react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

const ToolbarWrapper = () => {
  const editor = useEditor({ extensions: [StarterKit] });
  return <Toolbar editor={editor} />;
};
describe('Toolbar', () => {
  test('har knapp for H1', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'H1' })).toBeVisible();
  });

  test('har knapp for H2', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'H2' })).toBeVisible();
  });

  test('har knapp for H3', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'H3' })).toBeVisible();
  });

  test('har knapp for H4', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'H4' })).toBeVisible();
  });

  test('har knapp for bold', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'B' })).toBeVisible();
  });

  test('har knapp for kursiv', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'I' })).toBeVisible();
  });

  test('har knapp for punktliste', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'Punktliste' })).toBeVisible();
  });

  test('har knapp for nummerert liste', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'Nummerert liste' })).toBeVisible();
  });

  test('har knapp for å sette inn tabell', () => {
    render(<ToolbarWrapper />);
    expect(screen.getByRole('button', { name: 'Sett inn tabell' })).toBeVisible();
  });
});
