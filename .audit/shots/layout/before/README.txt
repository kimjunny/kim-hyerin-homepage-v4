No dark-mode capture exists for v3 because the site declared color-scheme: light only
and had zero prefers-color-scheme rules. Measured before values (1440x900, DPR1,
research.html, scrollY=700):

  .page-nav  background  rgb(255 255 255 / 92%)   <- hard-coded white in every scheme
  .site-header background rgb(255 255 255 / 86%)  backdrop-filter: saturate(180%) blur(12px)
  .eyebrow   color var(--blue) = #125fac on #ffffff = 2.19:1  (13px text, needs 4.5:1)
  :root      color-scheme: light                  <- OS dark preference ignored entirely
