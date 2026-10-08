# Nades Hands - Design

> A bakery order slip on a floured counter.

**Subject / audience / job:** A one-person campus bakery in Ghana that bakes loaf cakes and cupcakes once a week. Visitors are students, mostly on phones, who already know the baker or were sent the link. The one job: get an order paid before Thursday 5pm.
**Theme:** light

The page is quiet and warm: flour-coloured ground, cocoa ink, one butter-yellow highlight. Personality comes from the soft display serif and from the weekly rhythm of the business, which is drawn on the page instead of described. Photos of the bakes do the selling. Chrome stays flat and out of the way.

## The signature
**The bake week.** The shop runs on one cycle: order Monday to Thursday 5pm, bake Friday morning, deliver Friday afternoon to Sunday. That cycle is drawn as a seven-day strip with three bars (Order, Bake, Deliver) and today marked. It appears in full under the hero, and its result (the next bake date) is repeated as one line in the basket, at checkout and on the tracking page. Order summaries are drawn as slips with a dashed tear line.

## Color
| Name | Value | Role |
| --- | --- | --- |
| Flour | `#F7F3EE` | Page background |
| Paper | `#FFFDFA` | Raised surfaces: cards, dialogs, fields |
| Oat | `#EFE8DE` | Quiet fills: chips, image placeholders, secondary buttons |
| Crust | `#E6DCCF` | Borders and rules |
| Cocoa | `#3D2822` (deep `#2A1B17`) | Ink, primary buttons, footer |
| Mocha | `#76574A` | Secondary text |
| Butter | `#F2C14E` (soft `#FBEECB`) | The one highlight: today, the order window, basket count |

Status only: Leaf `#2F6B4F` for done, Jam `#A8322D` for errors. Neutrals are all tinted toward cocoa. No grey, no amber, no gradients.

## Type
- Display: Fraunces (variable, soft axis at 100), weight 500-600. Headlines, product names in dialogs, prices in totals.
- Body: Figtree, 400-700. Everything else.
- Scale: 16px base. Hero `clamp(2.5rem, 7vw, 4.75rem)` / 1.02 / -0.02em. Section heads `clamp(1.75rem, 3.5vw, 2.5rem)` / 1.1.
- Fallbacks: Georgia for display, system-ui for body.

## Spacing and shape
- Base unit 4px. Section gap `clamp(3.5rem, 8vw, 6rem)`. Card padding 16-24px.
- Radius: buttons and chips are pills, fields 12px, cards and images 20px, dialogs 28px.
- Shadow: one recipe (`shadow-lift`, cocoa-tinted), used on dialogs and the toast only. Cards use a Crust border.

## Layout
Left-aligned throughout, 1152px max width, 16px gutter on phones.

```
[ announcement: order by Thu 5pm                    ]
[ Nades Hands            Track order   Basket (2)   ]
+----------------------------+---------------------+
| Baked Friday morning.      |                     |
| At your door by the        |      photo 4:5      |
| weekend.                   |                     |
| [See the menu]             |                     |
+----------------------------+---------------------+
| Order by Thu 5pm for Fri 16 Oct   M T W T F S S   |
|                                   [Order ][B]     |
|                                           [Deliver]|
+---------------------------------------------------+
| This week's menu     [All][Loaf cake][Cupcakes]    |
| [photo] [photo] [photo]                            |
| name    name    name                               |
| GHS  +  GHS  +  GHS  +                             |
```

## Imagery
Product photos, 4:5, cover-cropped, 20px radius, Oat placeholder behind. The current photos are Unsplash stand-ins and should be replaced with the baker's own.

## Motion
One orchestrated moment: the hero text, photo and bake week rise in sequence on first load. Everything else is feedback: 200ms, `cubic-bezier(0.22, 1, 0.36, 1)`, transform and opacity only. Buttons press to 0.97. Dialogs slide in. All movement is dropped under `prefers-reduced-motion`.

## Do
- Say the date. "Friday 16 Oct" beats "this weekend".
- Call it the basket, everywhere.
- Keep one primary action per screen, in Cocoa.

## Don't
- No emoji, no uppercase tracked labels, no italic accent words.
- No invented reviews, counts or badges.
- No second accent colour. Butter is for the order window and counts, not decoration.
