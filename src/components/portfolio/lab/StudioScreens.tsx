import { useLayoutEffect, useRef, type CSSProperties } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiLayers,
  FiMapPin,
  FiMessageCircle,
  FiMinus,
  FiMousePointer,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import type { Locale } from "../types";
import logo from "./assets/salchi-logo.webp";
import salchiDish from "./assets/salchi-exclusiva.webp";
import glass from "./assets/everest-frutos.webp";
import octava from "./assets/milk-octava-maravilla.webp";
import mm from "./assets/milk-mega-mm.webp";
import frutal from "./assets/milk-mega-frutal.webp";
import oreo from "./assets/milk-mega-oreo.webp";
import {
  galleryPosition,
  interval,
  sites,
  smooth,
  sourceCode,
  words,
} from "./flowScenes";
import "./studio-assembly.css";

const appear = (t: number, from: number, to: number) =>
  smooth(interval(t, from, to));
// Each piece moves from an exploded position to its actual slot, in either scroll direction.
function assemble(k: number, x = 0, y = 20, turn = 0): CSSProperties {
  const offset = 1 - k;
  return {
    opacity: k,
    transform: `perspective(850px) translate(${x * offset}px,${y * offset}px) rotate(${turn * offset}deg) scale(${0.89 + 0.11 * k})`,
  };
}
type CursorKey = readonly [
  time: number,
  selector: string,
  x: number,
  y: number,
];
const headerCursor: CursorKey[] = [
  [0.105, ".brand-slot", 0.1, 0.85],
  [0.139, ".brand-slot", 0.6, 0.85],
  [0.166, ".links-slot", 0.73, 0.72],
  [0.19, ".salchi-city", 0.55, 0.9],
  [0.212, ".salchi-bag", 0.82, 0.75],
  [0.224, ".salchi-bag", 0.82, 0.75],
];
const cartCursor: CursorKey[] = [
  [0.407, ".cart-heading", 0.67, 0.65],
  [0.446, ".cart-item", 0.8, 0.8],
  [0.475, ".stepper", 0.5, 0.85],
  [0.497, ".stepper i", 0.52, 0.6],
  [0.506, ".stepper i", 0.52, 0.6],
  [0.523, ".cart-total strong", 0.8, 0.9],
];
const menuCursor: CursorKey[] = [
  [0.68, ".milk-filters", 0.03, 0.95],
  [0.709, '.milk-filters [data-selected="true"]', 0.7, 0.84],
  [0.739, ".milk-slot:nth-child(1)", 0.78, 0.74],
  [0.757, ".milk-slot:nth-child(2)", 0.79, 0.7],
  [0.779, ".milk-slot:nth-child(3)", 0.78, 0.76],
  [0.803, ".milk-slot:nth-child(4)", 0.88, 0.86],
];
function ComponentPointer({ t, keys }: { t: number; keys: CursorKey[] }) {
  const pointer = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = pointer.current,
      root = el?.parentElement;
    if (!el || !root) return;
    const start = keys[0][0],
      end = keys[keys.length - 1][0];
    const fade =
      appear(t, start, start + 0.008) *
      (1 - appear(t, end - 0.003, end + 0.01));
    el.style.opacity = String(fade);
    if (!fade) return;
    const next = keys.findIndex((key) => key[0] >= t);
    const right = next < 0 ? keys.length - 1 : next,
      left = Math.max(0, right - 1);
    const a = keys[left],
      b = keys[right];
    const mix = left === right ? 0 : appear(t, a[0], b[0]);
    const place = () => {
      const bounds = root.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const position = (key: CursorKey) => {
        const target =
          root.querySelector(key[1])?.getBoundingClientRect() || bounds;
        return [
          ((target.left - bounds.left + target.width * key[2]) * 100) /
            bounds.width,
          ((target.top - bounds.top + target.height * key[3]) * 100) /
            bounds.height,
        ];
      };
      const from = position(a),
        to = position(b);
      el.style.left = from[0] + (to[0] - from[0]) * mix + "%";
      el.style.top = from[1] + (to[1] - from[1]) * mix + "%";
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    return () => observer.disconnect();
  }, [t, keys]);
  return (
    <span ref={pointer} className="component-pointer">
      <FiMousePointer />
    </span>
  );
}
const sectionNames = ["Inicio", "La carta", "Domicilios", "Sedes"];
function HeaderAssembly({ t }: { t: number }) {
  const logoFit = appear(t, 0.096, 0.14),
    navFit = appear(t, 0.138, 0.179);
  const city = appear(t, 0.17, 0.199),
    order = appear(t, 0.187, 0.217);
  const code = sourceCode.slice(
    0,
    Math.round(sourceCode.length * interval(t, 0.149, 0.23)),
  );
  return (
    <div className="assembly act-header">
      <div className="assembly-bounds">
        <div
          className="header-work"
          style={{ "--guide-visibility": 1 - 0.93 * order } as CSSProperties}
        >
          <div className="header-guide">
            <span>&lt;header&gt;</span>
            <i />
          </div>
          <div className="salchi-nav">
            <div className="nav-slot brand-slot">
              <div
                className="salchi-brand"
                style={assemble(logoFit, -58, 12, -4)}
              >
                <img src={logo} alt="" />
                <b>Salchiwarrior</b>
              </div>
            </div>
            <div className="nav-slot links-slot">
              <div className="salchi-links">
                {sectionNames.map((item, i) => (
                  <span
                    key={item}
                    style={assemble(
                      appear(t, 0.128 + i * 0.009, 0.152 + i * 0.009),
                      0,
                      -19,
                    )}
                  >
                    {item}
                    {!i && <i style={{ transform: `scaleX(${navFit})` }} />}
                  </span>
                ))}
              </div>
            </div>
            <div className="nav-slot order-slot">
              <div className="salchi-city" style={assemble(city, 24, -12)}>
                <FiMapPin /> Manizales <FiChevronDown />
              </div>
              <span className="salchi-bag" style={assemble(order, 45, 8, -4)}>
                <FiShoppingBag /> Mi pedido <b>0</b>
              </span>
            </div>
          </div>
          <div className="salchi-hero">
            <div className="salchi-copy">
              <small>La</small>
              <strong>Exclusiva</strong>
              <div
                className="header-code"
                style={{ opacity: 0.1 + 0.9 * appear(t, 0.125, 0.163) }}
              >
                <span>
                  HTML <i>header.html</i>
                </span>
                <pre>
                  {code.split("\n").map((line, i) => (
                    <span key={i}>
                      {line.split(/(<\/?[a-z]+|>|…)/g).map((token, j) => (
                        <b
                          key={j}
                          data-tag={token.startsWith("<") || token === ">"}
                        >
                          {token}
                        </b>
                      ))}
                    </span>
                  ))}
                  <em />
                </pre>
              </div>
            </div>
            <div className="salchi-product">
              <i />
              <img src={salchiDish} alt="" draggable={false} />
            </div>
          </div>
        </div>
      </div>
      <ComponentPointer t={t} keys={headerCursor} />
    </div>
  );
}
const money = (amount: number) =>
  "$" + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export function CartAssembly({ t }: { t: number }) {
  const panel = appear(t, 0.386, 0.421),
    row = appear(t, 0.415, 0.459),
    quantityFit = appear(t, 0.45, 0.477);
  const totalFit = appear(t, 0.467, 0.496),
    checkout = appear(t, 0.492, 0.525);
  const double = t >= 0.502;
  const plus = 1 - Math.min(1, Math.abs(t - 0.502) / 0.01);
  return (
    <div className="assembly act-cart">
      <div className="assembly-bounds">
        <div className="cart-composition">
          <div className="everest-art">
            <span>EVEREST COCKTAILS</span>
            <strong>
              FRUTOS
              <br />
              <i>DEL BOSQUE</i>
            </strong>
            <img src={glass} alt="" draggable={false} />
          </div>
          <div className="cart-sheet">
            <div
              className="cart-foundation"
              style={{ opacity: 0.32 + 0.68 * panel }}
            />
            <div className="cart-content">
              <div className="cart-heading" style={assemble(panel, 24, -17)}>
                <small>
                  <FiMapPin /> Domicilios en Cali
                </small>
                <div>
                  <h4>Mi pedido</h4>
                  <FiShoppingBag />
                </div>
              </div>
              <div className="cart-product-slot">
                <div className="cart-line" style={assemble(row, 47, 10, 2)}>
                  <div className="cart-photo">
                    <img src={glass} alt="" />
                  </div>
                  <div className="cart-item">
                    <strong>Frutos del Bosque</strong>
                    <span>{money(20000)}</span>
                  </div>
                  <div className="stepper" style={assemble(quantityFit, 0, 16)}>
                    <FiMinus />
                    <b>{double ? 2 : 1}</b>
                    <i
                      style={{
                        backgroundColor: `rgba(160,80,189,${plus * 0.45})`,
                        transform: `scale(${1 + 0.16 * plus})`,
                      }}
                    >
                      <FiPlus />
                    </i>
                  </div>
                </div>
              </div>
              <div className="cart-total" style={assemble(totalFit, 0, 16)}>
                <span>Subtotal</span>
                <strong>{money(double ? 40000 : 20000)}</strong>
              </div>
              <div className="cart-checkout" style={assemble(checkout, 0, 24)}>
                <span>El valor del envío se confirma por WhatsApp.</span>
                <div>
                  <FiMessageCircle /> Continuar por WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ComponentPointer t={t} keys={cartCursor} />
    </div>
  );
}
const products = [
  { name: "Octava Maravilla", price: 84700, photo: octava, color: "#ffdc69" },
  { name: "Mega M&M", price: 28900, photo: mm, color: "#f2a5be" },
  { name: "Mega Frutal", price: 28900, photo: frutal, color: "#efb892" },
  { name: "Mega Oreo", price: 28900, photo: oreo, color: "#d0b4e9" },
];
const categories = [
  "Todas las categorías",
  "Megas",
  "New Megas",
  "Malteadas recomendadas",
];
export function MenuAssembly({ t }: { t: number }) {
  const title = appear(t, 0.657, 0.695);
  return (
    <div className="assembly act-menu">
      <div className="assembly-bounds">
        <div className="menu-layout">
          <div
            className="milk-heading"
            style={assemble(0.35 + 0.65 * title, -20, 0)}
          >
            <span>MilkShake Bogotá</span>
            <h4>Carta completa</h4>
          </div>
          <div className="milk-filters">
            {categories.map((cat, i) => (
              <span
                key={cat}
                data-selected={i === 1}
                style={assemble(
                  appear(t, 0.674 + i * 0.007, 0.695 + i * 0.007),
                  -18,
                  0,
                )}
              >
                {cat}
              </span>
            ))}
          </div>
          <div className="milk-cards">
            {products.map((p, i) => {
              const offset = i * 0.011,
                card = appear(t, 0.702 + offset, 0.731 + offset),
                photo = appear(t, 0.713 + offset, 0.755 + offset),
                label = appear(t, 0.749 + offset, 0.775 + offset);
              return (
                <div key={p.name} className="milk-slot">
                  <article
                    className="milk-card"
                    style={
                      {
                        ...assemble(card, (i - 1.5) * 23, 30, i % 2 ? 4 : -4),
                        "--flavour": p.color,
                      } as CSSProperties
                    }
                  >
                    <div className="milk-photo">
                      <img
                        style={assemble(photo, 0, 30, i % 2 ? 9 : -9)}
                        src={p.photo}
                        alt=""
                        draggable={false}
                      />
                    </div>
                    <div
                      className="milk-description"
                      style={assemble(label, 0, 13)}
                    >
                      <strong>{p.name}</strong>
                      <div>
                        <span>{money(p.price)}</span>
                        <i>
                          <FiPlus />
                        </i>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ComponentPointer t={t} keys={menuCursor} />
    </div>
  );
}
function Deployment({ t, locale }: { t: number; locale: Locale }) {
  const w = words[locale];
  return (
    <div className="deployment-screen">
      <div className="studio-chrome">
        <span className="chrome-title">
          <FiLayers />
          {w.delivery}
        </span>
      </div>
      <div className="release-rows">
        {sites.map((s, i) => {
          const k = smooth(interval(t, 0.864 + i * 0.006, 0.923 + i * 0.008));
          return (
            <div
              key={s.id}
              className="release-row"
              style={{ borderColor: s.accent + "65" }}
            >
              <img src={s.cover} alt="" draggable={false} />
              <div className="release-info">
                <strong>{s.name}</strong>
                <span>{w.components[i]}</span>
                <div className="release-rail">
                  <i
                    style={{ background: s.accent, transform: `scaleX(${k})` }}
                  />
                </div>
              </div>
              <span className="release-state" style={{ color: s.accent }}>
                {k >= 1 ? (
                  <>
                    <FiCheck />
                    {w.live}
                  </>
                ) : k < 0.29 ? (
                  w.files
                ) : k < 0.78 ? (
                  w.build
                ) : (
                  w.publish
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function Finished({ t, locale }: { t: number; locale: Locale }) {
  const pos = galleryPosition(t),
    site = sites[Math.round(pos)];
  return (
    <div className="finished-screen">
      <div className="studio-chrome">
        <span className="chrome-title">{site.name}</span>
        <span className="chrome-live">
          <FiCheck />
          {words[locale].live}
        </span>
      </div>
      <div
        className="finished-track"
        style={{ transform: `translateX(${-720 * pos}px)` }}
      >
        {sites.map((s) => (
          <div
            className="finished-page"
            key={s.id}
            style={{ background: s.accent }}
          >
            <img src={s.cover} alt="" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
export function LaptopScreen({ t, locale }: { t: number; locale: Locale }) {
  if (t < 0.84) return <HeaderAssembly t={t} />;
  const gallery = smooth(interval(t, 0.943, 0.954));
  return (
    <div
      className="studio-reel"
      style={{ transform: `translateY(${-426 * gallery}px)` }}
    >
      <Deployment t={t} locale={locale} />
      <Finished t={t} locale={locale} />
    </div>
  );
}
