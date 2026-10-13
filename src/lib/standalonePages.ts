/**
 * Pages hébergées sur le site mais présentées sous leur propre marque :
 * l'habillage General Esquire (barre de navigation, pied de page, boutons
 * flottants langue / avis) n'y est pas affiché.
 * Même principe que la page d'accueil, où la Navbar se masque déjà.
 */
export const STANDALONE_PAGE_PREFIXES = ["/runwei"];

export function isStandalonePage(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return STANDALONE_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
