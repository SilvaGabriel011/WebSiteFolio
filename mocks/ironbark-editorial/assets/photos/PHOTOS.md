# Fotos do mock editorial — lista de compras

A página já está ligada a estes 7 arquivos. **Basta salvar cada foto nesta
pasta com o nome exato abaixo** — nenhum código precisa mudar. Enquanto um
arquivo não existir, a página cai automaticamente na ilustração SVG
correspondente (atributo `onerror` de cada `<img>`).

## Especificação

Salvar como JPG, largura ~1600px, qualidade ~75 (no Unsplash/Pexels, o
botão de download médio/large resolve; se baixar o original, reduza — cada
arquivo idealmente entre 150 e 400 KB).

| Arquivo | Assunto | Enquadramento | Termos de busca sugeridos |
|---|---|---|---|
| `01-hero-kitchen.jpg` | Cozinha sob medida em madeira escura/blackbutt, pé-direito alto | Horizontal, geral da cozinha | *dark timber kitchen joinery*, *walnut kitchen cabinetry* |
| `02-island.jpg` | Ilha de cozinha em madeira clara com pedra, banquetas | Horizontal | *kitchen island timber stone benchtop* |
| `03-vanity.jpg` | Gabinete de banheiro suspenso, cuba dupla | Horizontal | *floating bathroom vanity twin basin* |
| `04-media-wall.jpg` | Painel/rack de TV em madeira ripada (fluted) | Horizontal | *fluted timber media wall*, *tv cabinet joinery* |
| `05-library.jpg` | Estante de piso a teto, escada deslizante se possível | Horizontal | *floor to ceiling bookshelf library ladder* |
| `06-wardrobe.jpg` | Closet/walk-in em marcenaria, iluminação embutida | Horizontal | *walk-in wardrobe joinery* |
| `07-pantry.jpg` | Despensa estilo butler's pantry, prateleiras abertas | Horizontal | *butlers pantry shelving timber* |

## Coesão visual

Não precisa que as fotos combinem perfeitamente entre si — a página aplica
um filtro tonal leve (`saturate .94 / contrast 1.03 / sepia .05`) que
unifica fotos de fontes diferentes no clima editorial quente. Prefira
fotos com madeira aparente e luz natural; evite fotos com pessoas em
primeiro plano e marcas visíveis.

## Licença

Usar fontes com licença livre para uso comercial. CC BY exige atribuição —
os créditos ficam no colophon da própria página e neste registro:

- `01-hero-kitchen.jpg` — pendente (ver estado da curadoria abaixo)
- `02-island.jpg` — pendente
- `03-vanity.jpg` — OK: "Walk In Closet" (ensuite), Blueprint Homes, CC BY 2.0 — flickr.com/photos/187015085@N02/49685642182 (adaptada: recompressão + filtro tonal)
- `04-media-wall.jpg` — pendente
- `05-library.jpg` — OK: "The Library at Chirk", Brian Smithson, CC BY 2.0 — flickr.com/photos/15636379@N00/5949508817 (adaptada: recompressão + filtro tonal)
- `06-wardrobe.jpg` — OK: "Walk In Closet", Blueprint Homes, CC BY 2.0 — flickr.com/photos/187015085@N02/49688664678 (adaptada: recompressão + filtro tonal)
- `07-pantry.jpg` — pendente

## Estado da curadoria (2026-07-29)

Varredura feita via Openverse (Flickr/Wikimedia/CC): ~70 candidatas
avaliadas em folha de contato. Só 3 passaram o corte de qualidade — o
acervo CC de interiores é dominado por foto amadora de imobiliária, e
foto ruim derruba o mock em vez de elevar. Os 4 slots pendentes seguem
com as pranchas ilustradas (o fallback), o que funciona como conceito
editorial: fotografia para o construído, prancha para o desenhado.

Para completar os 4 com fotografia profissional: criar uma chave gratuita
da API do Unsplash (unsplash.com/developers) ou Pexels (pexels.com/api) —
o acesso anônimo de ambos está bloqueado por anti-bot. Com a chave em
mãos, a busca, o download e a otimização são automatizáveis, para este
mock e para os 12 sites.
