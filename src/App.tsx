import { useEffect, useState } from 'react';
import { Accordion } from '@ark-ui/react/accordion';
import { Select, createListCollection } from '@ark-ui/react/select';
import { Tabs } from '@ark-ui/react/tabs';

const themes = createListCollection({
  items: [
    { label: 'Rijksoverheid', value: 'rijk' },
    { label: 'Gemeente Utrecht', value: 'utrecht' },
    { label: 'Gemeente Den Haag', value: 'denhaag' },
    { label: 'Gemeente Veenendaal (NLDS Basis)', value: 'basis' },
  ],
});

type PageKey =
  | 'home'
  | 'dossier'
  | 'taken'
  | 'berichten'
  | 'zaken'
  | 'producten'
  | 'belastingzaken'
  | 'woz'
  | 'parkeren'
  | 'erfpacht'
  | 'vakantieverhuur'
  | 'agenda'
  | 'plan'
  | 'gegevens'
  | 'brief';

type NavItem = { label: string; icon: string; key: PageKey; badge?: number };
const nav: NavItem[] = [
  { label: 'Home', icon: 'icon-grid', key: 'home' },
  { label: 'Nabestaandendossier', icon: 'icon-clipboard', key: 'dossier' },
  { label: 'Mijn taken', icon: 'icon-checks', key: 'taken' },
  { label: 'Mijn berichten', icon: 'icon-mail', key: 'berichten', badge: 4 },
  { label: 'Mijn zaken', icon: 'icon-folder', key: 'zaken' },
  { label: 'Mijn producten', icon: 'icon-card', key: 'producten' },
  { label: 'Belastingzaken', icon: 'icon-euro', key: 'belastingzaken' },
  { label: 'WOZ', icon: 'icon-home', key: 'woz' },
  { label: 'Parkeren', icon: 'icon-parking', key: 'parkeren' },
  { label: 'Erfpacht', icon: 'icon-building', key: 'erfpacht' },
  { label: 'Vakantieverhuur', icon: 'icon-bed', key: 'vakantieverhuur' },
  { label: 'Mijn agenda', icon: 'icon-calendar', key: 'agenda' },
  { label: 'Mijn plan', icon: 'icon-plan', key: 'plan' },
  { label: 'Mijn gegevens', icon: 'icon-user', key: 'gegevens' },
];
const labels: Record<string, string> = {
  ...Object.fromEntries(nav.map((n) => [n.key, n.label])),
  brief: 'Contactpersoon doorgeven aan de Belastingdienst',
};

// Volledige takenlijst voor de Mijn taken-pagina, met categorie + status.
type TaakCat = 'belangrijkste' | 'ingevuld' | 'geenactie';
type Taak = { titel: string; org: string; deadline?: string; ai?: boolean; terInfo?: boolean; cat: TaakCat };
const takenOpen: Taak[] = [
  { titel: 'Contactpersoon doorgeven aan de Belastingdienst', org: 'Belastingdienst', deadline: 'vóór 2 juli 2026', cat: 'belangrijkste' },
  { titel: 'Aanslag waterschapsbelasting betalen', org: 'Waterschap', deadline: 'vóór 7 augustus 2026', cat: 'belangrijkste' },
  { titel: 'Terugvordering zorgtoeslag — betalen of bezwaar', org: 'Dienst Toeslagen', deadline: 'vóór 18 juli 2026', ai: true, cat: 'ingevuld' },
  { titel: 'Aangifte erfbelasting indienen', org: 'Belastingdienst', deadline: 'vóór 28 april 2027', ai: true, cat: 'ingevuld' },
  { titel: 'Voertuig op naam van Cees — informatie', org: 'RDW', terInfo: true, cat: 'geenactie' },
  { titel: 'Overlijdensuitkering AOW', org: 'Sociale Verzekeringsbank', terInfo: true, cat: 'geenactie' },
  { titel: 'Zorgtoeslag herzien (beschikking)', org: 'Dienst Toeslagen', terInfo: true, cat: 'geenactie' },
  { titel: 'Condoleancebericht van het CAK', org: 'CAK', terInfo: true, cat: 'geenactie' },
  { titel: 'Condoleancebericht van de gemeente', org: 'Gemeente', terInfo: true, cat: 'geenactie' },
];
const takenDone: Taak[] = [
  { titel: 'WLZ-eigen bijdrage CAK stopgezet', org: 'CAK', terInfo: true, cat: 'geenactie' },
];
const takenFilters: { key: 'alle' | TaakCat; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'belangrijkste', label: 'Belangrijkste' },
  { key: 'ingevuld', label: 'Ingevuld door AI' },
  { key: 'geenactie', label: 'Geen actie nodig' },
];

const zaken = [
  { titel: 'Aanvraag subsidie geluidisolatie', id: 'ZK-29124' },
  { titel: 'WMO-melding', id: 'ZK-02612' },
  { titel: 'Aanvraag parkeervergunning', id: 'ZK-02599' },
];

const berichten = [
  { org: 'Belastingdienst', titel: 'Aangifte erfbelasting indienen', datum: '30 augustus 2026', ongelezen: true },
  { org: 'Waterschap', titel: 'Aanslag waterschapsbelasting betalen', datum: '25 juni 2026', ongelezen: true },
  { org: 'CAK', titel: 'Eindafrekening eigen bijdrage Wlz betalen', datum: '10 juni 2026' },
  { org: 'Dienst Toeslagen', titel: 'Terugvordering zorgtoeslag — betalen of bezwaar', datum: '5 juni 2026', ongelezen: true },
  { org: 'Belastingdienst', titel: 'Contactpersoon doorgeven aan de Belastingdienst', datum: '1 juni 2026', ongelezen: true },
  { org: 'Dienst Toeslagen', titel: 'Zorgtoeslag herzien (beschikking)', datum: '29 mei 2026' },
  { org: 'RDW', titel: 'Voertuig op naam van Cees — informatie', datum: '22 mei 2026' },
  { org: 'Sociale Verzekeringsbank', titel: 'Overlijdensuitkering AOW', datum: '22 mei 2026' },
  { org: 'CAK', titel: 'Condoleancebericht van het CAK', datum: '20 mei 2026' },
  { org: 'Gemeente', titel: 'Condoleancebericht van de gemeente', datum: '19 mei 2026' },
];

const zakenLijst = [
  { naam: 'Aanvraag subsidie geluidisolatie', datum: '17-10-2024', status: 'Open' },
  { naam: 'Wmo-melding', datum: '29-9-2024', status: 'Open' },
  { naam: 'Opzeggen parkeervergunning', datum: '5-12-2023', status: 'Open' },
  { naam: 'Aanvraag afkoop canon Keukenlaan 133', datum: '5-12-2023', status: 'Open' },
  { naam: 'Adres onderzoek', datum: '5-12-2023', status: 'Open' },
  { naam: 'Bezwaar tegen waardering onroerende zaken', datum: '5-12-2023', status: 'Open' },
  { naam: 'Aanvraag vakantieverhuur Dierenselaan 88', datum: '5-12-2023', status: 'Gesloten' },
  { naam: 'Aanvraag mantelzorg parkeervergunning', datum: '5-12-2023', status: 'Gesloten' },
  { naam: 'Aanvraag parkeervergunning', datum: '5-12-2023', status: 'Gesloten' },
  { naam: 'Verhuizing doorgeven', datum: '3-11-2023', status: 'Gesloten' },
];

const documenten = [
  { titel: 'Akte van overlijden', org: 'Gemeente', tekst: 'Het officiële uittreksel uit de registers van de burgerlijke stand.' },
  { titel: 'Verklaring van erfrecht', org: 'Notaris', tekst: 'Toont wie de erfgenamen zijn en wie de nalatenschap mag afhandelen.' },
  { titel: 'Overzicht mogelijke rechten', org: 'SVB', tekst: 'Mogelijk recht op Anw-uitkering of nabestaandenpensioen.' },
];

const briefMeta = [
  ['Afzender', 'Belastingdienst'],
  ['Soort brief', 'Actiebrief'],
  ['Ontvangen', '1 juni 2026'],
  ['Aanhef', 'Aan de erven van'],
  ['Gericht aan', 'De erven van de overledene'],
  ['Bezorgd op', 'Zorgcentrum De Wilg 1, 3511 AB Utrecht — verzorgingstehuis'],
  ['Uiterlijk reageren', 'vóór 2 juli 2026'],
  ['Leidt tot zaak', 'Contactpersoon doorgeven aan Belastingdienst'],
  ['Kenmerk', 'BD.ERVENBRIEF'],
];

type ThemeData = {
  title: string;
  tasks: [string, string][];
  actions: string[];
  itemsTitle: string;
  itemsHead: [string, string, string];
  items: [string, string, string][];
};
const themeData: Record<string, ThemeData> = {
  woz: {
    title: 'WOZ',
    tasks: [['Geef meer informatie over uw WOZ-bezwaar', 'vóór 2 juni 2026']],
    actions: ['WOZ-waarde bekijken', 'Bezwaar maken tegen WOZ-waarde', 'Taxatieverslag downloaden', 'Adresgegevens controleren'],
    itemsTitle: 'WOZ-objecten',
    itemsHead: ['Object', 'Beschikking', 'Waarde'],
    items: [
      ['Keukenlaan 133', 'WOZ-waarde 2024', '€ 438.000'],
      ['Garagebox Valeriusplein', 'WOZ-waarde 2024', '€ 34.000'],
      ['Keukenlaan 133', 'WOZ-waarde 2023', '€ 412.000'],
      ['Keukenlaan 133', 'WOZ-waarde 2022', '€ 389.000'],
    ],
  },
  parkeren: {
    title: 'Parkeren',
    tasks: [['Betaal uw parkeerbon van € 74,90 voor parkeren bij Valeriusplein', 'vóór 1 maart 2026']],
    actions: ['Parkeervergunning aanvragen', 'Kenteken wijzigen', 'Parkeerbon betalen', 'Mantelzorgvergunning aanvragen'],
    itemsTitle: 'Parkeerproducten',
    itemsHead: ['Product', 'Kenmerk', 'Status'],
    items: [
      ['Parkeervergunning bewoners', '34-FJT-23', 'Actief'],
      ['Parkeerbon', '34-FJT-23', 'Nog te betalen'],
      ['Mantelzorgvergunning', 'Keukenlaan 133', 'Verleend'],
      ['Bezoekersregeling', 'Zone Centrum', 'Actief'],
    ],
  },
  erfpacht: {
    title: 'Erfpacht',
    tasks: [['Betaal uw erfpachtfactuur van € 27,52 voor Keukenhoflaan 133 (juli–december 2025)', 'vóór 12 december 2025']],
    actions: ['Erfpachtcanon bekijken', 'Afkoop canon aanvragen', 'Erfpachtcontract downloaden', 'Adres erfpachtobject wijzigen'],
    itemsTitle: 'Erfpachtcontracten',
    itemsHead: ['Object', 'Onderdeel', 'Status'],
    items: [
      ['Keukenlaan 133', 'Contract 2023', '1 taak open'],
      ['Keukenlaan 133', 'Factuur juli–december', 'Nog te betalen'],
      ['Keukenlaan 133', 'Afkoopberekening', 'In behandeling'],
      ['Keukenlaan 133', 'Canon overzicht', 'Beschikbaar'],
    ],
  },
  vakantieverhuur: {
    title: 'Vakantieverhuur',
    tasks: [],
    actions: ['Vakantieverhuur melden', 'Nachtteller bekijken', 'Melding wijzigen', 'Voorwaarden vakantieverhuur bekijken'],
    itemsTitle: 'Meldingen vakantieverhuur',
    itemsHead: ['Object', 'Onderdeel', 'Status'],
    items: [
      ['Dierenselaan 88', 'Melding 2024', 'Afgehandeld'],
      ['Dierenselaan 88', 'Nachtteller', '18 nachten gebruikt'],
      ['Dierenselaan 88', 'Voorwaarden', 'Beschikbaar'],
      ['Dierenselaan 88', 'Correspondentie', '2 berichten'],
    ],
  },
};

const producten = [
  { titel: 'Erfpachtcontract', sub: 'Keukenhoflaan 133', groep: 'Erfpacht' },
  { titel: 'Verhuurontheffing', sub: 'Dierenselaan 88', groep: 'Vakantieverhuur' },
  { titel: 'Parkeervergunning bewoners', sub: '34-FJT-23', groep: 'Parkeren' },
  { titel: 'Parkeerbon', sub: '34-FJT-23', groep: 'Parkeren' },
];

const taxTasks: [string, string][] = [
  ['Betaal uw gemeentelijke belasting van € 6.982,30', 'vóór 1 maart 2026'],
  ['Betaal uw rioolrecht grootafvoer van € 211,30 (aanslagnummer 2212002751)', 'vóór 1 april 2026'],
  ['Geef meer informatie over uw bezwaar tegen afvalstoffenheffing 2026', 'vóór 2 juni 2026'],
];
const taxActions = [
  'Bezwaar maken tegen een aanslag',
  'Meerdere documenten in één keer downloaden',
  'Belasting gespreid betalen met automatische incasso',
  'Betalingsregeling aanvragen',
];

const afspraken = [
  { titel: 'Keukentafelgesprek Wmo-melding', wanneer: 'Maandag 7 oktober 2026, 10.30 uur', actie: 'Wijzigen of annuleren' },
  { titel: 'Balieafspraak identiteitskaart vernieuwen', wanneer: 'Dinsdag 22 oktober 2026, 14.15 uur', actie: 'Zet in eigen agenda' },
];
const planDoelen = [
  { titel: 'Rust in administratie', meta: '2 open taken' },
  { titel: 'Passende ondersteuning thuis', meta: '1 afspraak gepland' },
];

const faqs = [
  {
    q: 'Ik heb een vraag over de inhoud van een bericht.',
    a: 'MijnOverheid kan u niet helpen bij de inhoud van de berichten die u ontvangt. Neem contact op met de organisatie waarvan u het bericht heeft ontvangen. De contactgegevens staan in de brief die als bijlage bij het bericht zit.',
  },
  {
    q: 'Hoe weet ik wat er al automatisch is geregeld?',
    a: 'In uw Nabestaandendossier ziet u per onderwerp of er nog actie nodig is of dat het al automatisch is geregeld. Taken met het label “Geen actie nodig” zijn alleen ter informatie.',
  },
  {
    q: 'Bij wie kan ik terecht voor hulp?',
    a: 'Bel 1400 (maandag tot en met vrijdag van 8.00 tot 20.00 uur) of stel uw vraag via vragen@mijn.overheid.nl.',
  },
];

// Merkidentiteit per huisstijl: logo (lint = staand Rijkslint, mark = gemeentewapen) + naam.
type Brand = { name: string; lint?: string; mark?: string };
const brands: Record<string, Brand> = {
  rijk: { name: 'MijnOverheid', lint: '/rijksoverheid-lint.svg' },
  utrecht: { name: 'Gemeente Utrecht', mark: '/logos/utrecht.svg' },
  denhaag: { name: 'Den Haag', mark: '/logos/denhaag.svg' },
  basis: { name: 'Gemeente Veenendaal' },
};

function Icon({ id, className = 'icon' }: { id: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

function useHashRoute(): [PageKey, (p: PageKey) => void] {
  const read = (): PageKey => {
    const h = window.location.hash.replace(/^#\/?/, '') as PageKey;
    return h in labels ? h : 'home';
  };
  const [page, setPage] = useState<PageKey>(read);
  useEffect(() => {
    const onHash = () => setPage(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (p: PageKey) => {
    window.location.hash = `/${p}`;
    window.scrollTo(0, 0);
  };
  return [page, go];
}

function navLink(go: (p: PageKey) => void, p: PageKey) {
  return (e: { preventDefault: () => void }) => {
    e.preventDefault();
    go(p);
  };
}

function HuisstijlSwitcher({ theme, onChange }: { theme: string; onChange: (v: string) => void }) {
  return (
    <Select.Root
      collection={themes}
      value={[theme]}
      onValueChange={(d) => onChange(d.value[0])}
      positioning={{ sameWidth: true }}
    >
      <Select.Label className="masthead__switch-label">Huisstijl</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Kies huisstijl" />
          <Select.Indicator>▾</Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {themes.items.map((item) => (
            <Select.Item key={item.value} item={item}>
              <Select.ItemText>{item.label}</Select.ItemText>
              <Select.ItemIndicator>✓</Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

function HomePage({ go }: { go: (p: PageKey) => void }) {
  return (
    <>
      <h1>Hallo Jeroen van Drouwen</h1>
      <p className="intro">
        In ‘Mijn omgeving’ kunt u zelf uw persoonlijke zaken regelen wanneer het u uitkomt. U kunt bijvoorbeeld uw
        rekeningen betalen en zien wanneer uw aanvraag klaar is.
      </p>

      <a className="dossier" href="#/dossier" onClick={navLink(go, 'dossier')}>
        <span className="dossier__icon">
          <Icon id="icon-clipboard" />
        </span>
        <span>
          <span className="dossier__title">Nabestaandendossier</span>
          <span className="dossier__text">
            Na het overlijden van uw partner Cees moet er veel geregeld worden. Bekijk gebundeld wat er al automatisch
            is geregeld en wat nog uw aandacht vraagt.
          </span>
        </span>
        <span className="dossier__cta">
          4 taken openstaand <Icon id="icon-arrow" />
        </span>
      </a>

      <section className="section">
        <h2>Mijn taken</h2>
        <a className="section__link" href="#/taken" onClick={navLink(go, 'taken')}>
          Bekijk alle taken (4) <Icon id="icon-arrow" />
        </a>
        <div className="panel taken-panel">
          {takenOpen.slice(0, 4).map((t) => (
            <TaakPanelRow key={t.titel} taak={t} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Mijn lopende zaken</h2>
        <a className="section__link" href="#/zaken" onClick={navLink(go, 'zaken')}>
          Bekijk alle zaken (10) <Icon id="icon-arrow" />
        </a>
        <div className="cards">
          {zaken.map((z) => (
            <a className="card" href="#/zaken" key={z.id} onClick={navLink(go, 'zaken')}>
              <span className="card__title">{z.titel}</span>
              <span className="card__id">
                {z.id} <Icon id="icon-arrow" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

function TaakPanelRow({ taak }: { taak: Taak }) {
  return (
    <a className="task" href="#/brief">
      <span className="task__main">
        <span className="task__title">
          {taak.titel}
          {taak.ai && <span className="task__pill">Ingevuld door AI</span>}
        </span>
        <span className="task__org">{taak.org}</span>
      </span>
      {taak.terInfo ? (
        <span className="task__info">Ter info</span>
      ) : (
        <span className="task__deadline">{taak.deadline}</span>
      )}
      <span className="task__arrow">
        <Icon id="icon-arrow" />
      </span>
    </a>
  );
}

function TabCount({ children }: { children: number }) {
  return <span className="tab-count">{children}</span>;
}

function TakenPage() {
  const [filter, setFilter] = useState<'alle' | TaakCat>('alle');
  const [query, setQuery] = useState('');

  const count = (cat: 'alle' | TaakCat) => (cat === 'alle' ? takenOpen.length : takenOpen.filter((t) => t.cat === cat).length);
  const matches = (t: Taak) =>
    (filter === 'alle' || t.cat === filter) &&
    (query.trim() === '' || `${t.titel} ${t.org}`.toLowerCase().includes(query.toLowerCase()));
  const openFiltered = takenOpen.filter(matches);

  return (
    <>
      <h1>Mijn taken</h1>
      <p className="page-sub">Alle taken en brieven uit uw nabestaandendossier.</p>

      <Tabs.Root defaultValue="open" className="tabs">
        <Tabs.List className="tabs__list">
          <Tabs.Trigger value="open">
            Open taken <TabCount>{takenOpen.length}</TabCount>
          </Tabs.Trigger>
          <Tabs.Trigger value="afgerond">
            Afgerond <TabCount>{takenDone.length}</TabCount>
          </Tabs.Trigger>
          <Tabs.Indicator className="tabs__indicator" />
        </Tabs.List>

        <Tabs.Content value="open">
          <div className="zaken-toolbar">
            <input
              type="search"
              placeholder="Zoek in taken…"
              aria-label="Zoek in taken"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="button-primary" type="button" style={{ marginTop: 0 }}>
              Zoeken
            </button>
          </div>

          <div className="filter-pills">
            {takenFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`pill ${filter === f.key ? 'pill--active' : ''}`}
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label} <span className="pill__count">{count(f.key)}</span>
              </button>
            ))}
          </div>

          <div className="panel taken-panel">
            {openFiltered.length ? (
              openFiltered.map((t) => <TaakPanelRow key={t.titel} taak={t} />)
            ) : (
              <p style={{ padding: '18px 24px', margin: 0 }}>Geen taken gevonden.</p>
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="afgerond">
          <div className="panel taken-panel">
            {takenDone.map((t) => (
              <TaakPanelRow key={t.titel} taak={t} />
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

function DossierPage() {
  return (
    <>
      <h1>Nabestaandendossier</h1>
      <div className="alert" role="note">
        <span className="alert__icon" aria-hidden="true">
          ♥
        </span>
        <div>
          <strong>Gecondoleerd met het verlies van uw partner Cees.</strong> De overheid heeft de post van
          verschillende organisaties voor u gebundeld. Hieronder ziet u wat er al is geregeld en wat er nog uw aandacht
          vraagt.
        </div>
      </div>

      <section className="section">
        <h2>Wat moet ik regelen</h2>
        <div className="panel taken-panel">
          {takenOpen.slice(0, 4).map((t) => (
            <TaakPanelRow key={t.titel} taak={t} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Belangrijke documenten</h2>
        <Accordion.Root collapsible className="docs">
          {documenten.map((d) => (
            <Accordion.Item key={d.titel} value={d.titel}>
              <Accordion.ItemTrigger>
                {d.titel} <span style={{ opacity: 0.7, fontWeight: 400 }}>· {d.org}</span>
                <Accordion.ItemIndicator>▾</Accordion.ItemIndicator>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>{d.tekst}</Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    </>
  );
}

function BerichtenPage({ go }: { go: (p: PageKey) => void }) {
  return (
    <>
      <h1>Mijn berichten</h1>
      <p className="page-sub">
        Post van de overheid na het overlijden van uw partner Cees, gebundeld vanuit uw Nabestaandendossier.
      </p>
      <div className="panel berichten">
        <div className="table-row table-head">
          <span>Onderwerp</span>
          <span>Ontvangen</span>
        </div>
        {berichten.map((b) => (
          <a className="table-row" href="#/brief" key={b.titel} onClick={navLink(go, 'brief')}>
            <span>
              <span className="bericht__org">{b.org}</span>
              <span className="bericht__subject">
                {b.ongelezen && <span className="bericht__dot" aria-label="Ongelezen" />}
                {b.titel}
              </span>
            </span>
            <span className="bericht__date">{b.datum}</span>
          </a>
        ))}
      </div>
    </>
  );
}

function ZakenPage() {
  return (
    <>
      <h1>Mijn zaken</h1>
      <div className="zaken-toolbar">
        <input type="search" placeholder="Zoeken…" aria-label="Zoeken in zaken" />
        <button className="button-primary" type="button" style={{ marginTop: 0 }}>
          Zoeken
        </button>
        <button className="pagination" type="button" style={{ padding: '0 16px', borderRadius: 'var(--border-radius)', border: '1px solid var(--color-border)', background: 'var(--color-panel)', color: 'var(--color-secondary)' }}>
          <Icon id="icon-filter" /> Filter
        </button>
      </div>
      <p className="zaken-count">89 zaken</p>
      <div className="panel zaken">
        <div className="table-row table-head">
          <span>Naam</span>
          <span>Datum aanvraag</span>
          <span>Open of gesloten</span>
        </div>
        {zakenLijst.map((z) => (
          <div className="table-row" key={z.naam}>
            <span>{z.naam}</span>
            <span>{z.datum}</span>
            <span>{z.status}</span>
          </div>
        ))}
      </div>
      <nav className="pagination" aria-label="Paginering">
        <button aria-current="true">1</button>
        <button>2</button>
        <button>3</button>
        <button disabled style={{ border: 'none', background: 'none' }}>
          …
        </button>
        <button>9</button>
        <button>Volgende →</button>
      </nav>
    </>
  );
}

function GegevensPage() {
  return (
    <>
      <h1>Mijn gegevens</h1>
      <nav className="anchor-nav" aria-label="Onderdelen op deze pagina">
        <a href="#contactgegevens">Contactgegevens</a>
        <a href="#persoonsgegevens">Persoonsgegevens</a>
        <a href="#adresgegevens">Adresgegevens</a>
        <a href="#meldingen">Meldingen</a>
      </nav>

      <div className="datasection" id="contactgegevens">
        <div className="datasection__head">
          <h2>Contactgegevens</h2>
          <a href="#">Wijzigen</a>
        </div>
        <dl className="datalist">
          <dt>E-mailadres</dt>
          <dd>jeroen@example.test</dd>
          <dt>Telefoonnummer</dt>
          <dd>06 12345678</dd>
        </dl>
      </div>

      <div className="datasection" id="persoonsgegevens">
        <div className="datasection__head">
          <h2>Persoonsgegevens</h2>
          <a href="#">Wijzigen</a>
        </div>
        <dl className="datalist">
          <dt>Naam</dt>
          <dd>Jeroen van Drouwen</dd>
          <dt>Geboortedatum</dt>
          <dd>14 maart 1981</dd>
          <dt>Burgerservicenummer</dt>
          <dd>••••••782</dd>
        </dl>
        <h3 style={{ marginTop: 20 }}>Zie ook</h3>
        <ul>
          <li>
            <a href="#">Bekijk hoe de gemeente met persoonsgegevens omgaat</a>
          </li>
        </ul>
      </div>

      <div className="datasection" id="adresgegevens">
        <div className="datasection__head">
          <h2>Adresgegevens</h2>
          <a href="#">Wijzigen</a>
        </div>
        <dl className="datalist">
          <dt>Woonadres</dt>
          <dd>Keukenlaan 133, 1234 AB Voorbeeld</dd>
          <dt>Postadres</dt>
          <dd>Gelijk aan woonadres</dd>
        </dl>
      </div>

      <div className="datasection" id="meldingen">
        <div className="datasection__head">
          <h2>Meldingen</h2>
          <a href="#">Wijzigen</a>
        </div>
        <dl className="datalist">
          <dt>E-mail over nieuwe berichten</dt>
          <dd>Aan</dd>
          <dt>Sms over afspraken</dt>
          <dd>Uit</dd>
          <dt>Herinneringen voor taken</dt>
          <dd>Aan</dd>
        </dl>
      </div>
    </>
  );
}

function BriefPage({ go }: { go: (p: PageKey) => void }) {
  return (
    <>
      <a className="back-link" href="#/berichten" onClick={navLink(go, 'berichten')}>
        <Icon id="icon-arrow" /> Terug naar berichten
      </a>
      <h1>Contactpersoon doorgeven aan de Belastingdienst</h1>
      <p className="brief-sub">Brief van Belastingdienst · vóór 2 juli 2026</p>

      <div className="alert--warning" role="note">
        <span className="alert__icon" aria-hidden="true">
          ⚠
        </span>
        <div>
          Deze brief is gericht aan ‘de erven’ in plaats van aan u persoonlijk. De brief is bezorgd op het adres van het
          verzorgingstehuis van de overledene.
        </div>
      </div>

      <section className="section" style={{ marginTop: 0 }}>
        <h2>Wat wordt er gevraagd?</h2>
        <p>Contactpersoon doorgeven aan Belastingdienst</p>
        <a className="button-primary" href="#">
          Regel dit bij Belastingdienst
        </a>
      </section>

      <section className="section">
        <h2>Over deze brief</h2>
        <dl className="datalist" style={{ gridTemplateColumns: 'minmax(180px, 240px) 1fr' }}>
          {briefMeta.map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <dt style={{ fontWeight: 700, color: 'var(--color-text)' }}>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

function LinkRow({ titel, meta, href = '#' }: { titel: string; meta?: string; href?: string }) {
  return (
    <a className="task" href={href}>
      <span className="task__title">{titel}</span>
      <span className="task__deadline">{meta ?? ''}</span>
      <span className="task__arrow">
        <Icon id="icon-arrow" />
      </span>
    </a>
  );
}

function ItemsTable({ head, rows }: { head: [string, string, string]; rows: [string, string, string][] }) {
  return (
    <div className="panel zaken">
      <div className="table-row table-head">
        {head.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {rows.map((r) => (
        <div className="table-row" key={r.join('-')}>
          <span>{r[0]}</span>
          <span>{r[1]}</span>
          <span>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function ThemePage({ data }: { data: ThemeData }) {
  return (
    <>
      <h1>{data.title}</h1>
      <section className="section">
        <h2>Wat moet ik regelen</h2>
        {data.tasks.length ? (
          <div className="panel taken-panel">
            {data.tasks.map(([t, due]) => (
              <LinkRow key={t} titel={t} meta={due} href="#/taken" />
            ))}
          </div>
        ) : (
          <p className="intro">Er zijn geen openstaande taken.</p>
        )}
      </section>
      <section className="section">
        <h2>Wat kan ik regelen</h2>
        <div className="panel taken-panel">
          {data.actions.map((a) => (
            <LinkRow key={a} titel={a} />
          ))}
        </div>
      </section>
      <section className="section">
        <h2>{data.itemsTitle}</h2>
        <ItemsTable head={data.itemsHead} rows={data.items} />
      </section>
    </>
  );
}

function ProductenPage() {
  return (
    <>
      <h1>Mijn producten</h1>
      <p className="page-sub">Producten en vergunningen die u van de overheid heeft gekregen.</p>
      <div className="panel berichten">
        {producten.map((p) => (
          <a className="table-row" href="#" key={p.titel}>
            <span>
              <span className="bericht__subject" style={{ marginTop: 0 }}>
                {p.titel}
              </span>
              <span className="bericht__org">{p.sub}</span>
            </span>
            <span className="task__deadline">{p.groep}</span>
          </a>
        ))}
      </div>
    </>
  );
}

function BelastingzakenPage() {
  return (
    <>
      <h1>Belastingzaken</h1>
      <section className="section">
        <h2>Mijn taken</h2>
        <div className="panel taken-panel">
          {taxTasks.map(([t, due]) => (
            <LinkRow key={t} titel={t} meta={due} href="#/taken" />
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Wat kan ik regelen</h2>
        <div className="panel taken-panel">
          {taxActions.map((a) => (
            <LinkRow key={a} titel={a} />
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Aanslagen</h2>
        <ItemsTable
          head={['Aanslag', 'Jaar', 'Bedrag']}
          rows={[
            ['Gemeentelijke belastingen', '2026', '€ 6.982,30'],
            ['Rioolrecht grootafvoer', '2026', '€ 211,30'],
            ['Afvalstoffenheffing', '2026', '€ 348,00'],
            ['WOZ-beschikking', '2026', '€ 438.000'],
          ]}
        />
      </section>
    </>
  );
}

function AgendaPage() {
  return (
    <>
      <h1>Mijn agenda</h1>
      <p className="page-sub">Afspraken met de gemeente op één plek.</p>
      <section className="section" style={{ marginTop: 8 }}>
        <h2>Afspraken</h2>
        <div className="panel">
          {afspraken.map((a) => (
            <div className="table-row" key={a.titel} style={{ gridTemplateColumns: '1fr auto' }}>
              <span className="task__main">
                <span className="task__title" style={{ color: 'var(--color-text)' }}>
                  {a.titel}
                </span>
                <span className="task__org">{a.wanneer}</span>
              </span>
              <a href="#">{a.actie} →</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function PlanPage() {
  return (
    <>
      <h1>Mijn plan</h1>
      <p className="page-sub">Overzicht van doelen, taken, afspraken en contactpersonen.</p>
      <section className="section" style={{ marginTop: 8 }}>
        <h2>Mijn doelen</h2>
        <div className="cards">
          {planDoelen.map((d) => (
            <div className="card" key={d.titel} style={{ cursor: 'default' }}>
              <span className="card__title">{d.titel}</span>
              <span className="card__id">{d.meta}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Contactpersonen</h2>
        <dl className="datalist">
          <dt>Consulent</dt>
          <dd>R. de Vries</dd>
          <dt>Telefoon</dt>
          <dd>14 000</dd>
        </dl>
      </section>
    </>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <>
      <h1>{title}</h1>
      <p className="intro">Deze pagina is in deze demo nog niet uitgewerkt. De navigatie en huisstijl werken al.</p>
    </>
  );
}

function Faq() {
  return (
    <section className="faq">
      <h2>Veelgestelde vragen</h2>
      <Accordion.Root collapsible className="faq-list">
        {faqs.map((f) => (
          <Accordion.Item key={f.q} value={f.q}>
            <Accordion.ItemTrigger>
              <Accordion.ItemIndicator>›</Accordion.ItemIndicator>
              {f.q}
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>{f.a}</Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      <a className="faq-all" href="#">
        Bekijk alle veelgestelde vragen <Icon id="icon-arrow" />
      </a>
    </section>
  );
}

function Footer({ brand }: { brand: Brand }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a className="site-footer__brand" href="#/home">
          {brand.mark ? (
            <img className="site-footer__mark" src={brand.mark} alt="" aria-hidden="true" />
          ) : brand.lint ? (
            <img src={brand.lint} alt="" aria-hidden="true" />
          ) : null}
          {brand.name}
        </a>
        <section>
          <h2>Contact</h2>
          <p>
            Bel <a href="tel:1400" style={{ display: 'inline' }}>1400</a> maandag tot en met vrijdag van 8.00 tot 20.00
            of stel uw vraag via <a href="mailto:vragen@mijn.overheid.nl" style={{ display: 'inline' }}>vragen@mijn.overheid.nl</a>
          </p>
        </section>
        <nav aria-label="Footer">
          <a href="#">Over MijnOverheid</a>
          <a href="#">Nieuwsbrief</a>
          <a href="#">Toegankelijkheid</a>
          <a href="#">Werken bij de overheid</a>
        </nav>
        <nav aria-label="Juridisch">
          <a href="#">Bescherming persoonsgegevens</a>
          <a href="#">Gebruikersvoorwaarden</a>
          <a href="#">Proclaimer</a>
          <a href="#">Toegankelijkheidsverklaring</a>
        </nav>
      </div>
    </footer>
  );
}

export function App() {
  const [theme, setTheme] = useState('rijk');
  const [page, go] = useHashRoute();

  function applyTheme(value: string) {
    setTheme(value);
    document.documentElement.dataset.theme = value;
  }

  const built = [
    'home',
    'dossier',
    'taken',
    'berichten',
    'zaken',
    'gegevens',
    'brief',
    'producten',
    'belastingzaken',
    'agenda',
    'plan',
    ...Object.keys(themeData),
  ];

  const brand = brands[theme] ?? brands.rijk;

  return (
    <>
      <header className="masthead">
        {brand.lint && (
          <span className="masthead__lint" aria-hidden="true">
            <img src={brand.lint} alt="" />
          </span>
        )}
        <div className="masthead__inner">
          <a className="masthead__brand" href="#/home" onClick={navLink(go, 'home')}>
            {brand.mark && <img className="masthead__mark" src={brand.mark} alt="" />}
            {brand.name}
          </a>
          <div className="masthead__links">
            <a className="masthead__user" href="#/gegevens" onClick={navLink(go, 'gegevens')}>
              <Icon id="icon-user" />
              Jeroen van Drouwen
            </a>
            <a href="#">Uitloggen</a>
            <HuisstijlSwitcher theme={theme} onChange={applyTheme} />
          </div>
        </div>
      </header>
      <div className="accent-line" />

      <nav className="breadcrumb" aria-label="Kruimelpad">
        <a href="#/home" onClick={navLink(go, 'home')}>
          Home
        </a>
        {page !== 'home' && (
          <>
            {' › '}
            <span aria-current="page">{labels[page]}</span>
          </>
        )}
      </nav>

      <div className="layout">
        <aside className="sidenav" aria-label="Mijn omgeving">
          <ul>
            {nav.map((n) => (
              <li key={n.key}>
                <a
                  href={`#/${n.key}`}
                  aria-current={page === n.key ? 'page' : undefined}
                  className={page === n.key ? 'is-current' : ''}
                  onClick={navLink(go, n.key)}
                >
                  <Icon id={n.icon} />
                  <span>{n.label}</span>
                  {n.badge && <span className="sidenav__badge">{n.badge}</span>}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="shell" id="main">
          {page === 'home' && <HomePage go={go} />}
          {page === 'dossier' && <DossierPage />}
          {page === 'taken' && <TakenPage />}
          {page === 'berichten' && <BerichtenPage go={go} />}
          {page === 'zaken' && <ZakenPage />}
          {page === 'gegevens' && <GegevensPage />}
          {page === 'brief' && <BriefPage go={go} />}
          {page === 'producten' && <ProductenPage />}
          {page === 'belastingzaken' && <BelastingzakenPage />}
          {page === 'agenda' && <AgendaPage />}
          {page === 'plan' && <PlanPage />}
          {page in themeData && <ThemePage data={themeData[page]} />}
          {!built.includes(page) && <Placeholder title={labels[page]} />}

          <Faq />
        </main>
      </div>

      <Footer brand={brand} />
    </>
  );
}
