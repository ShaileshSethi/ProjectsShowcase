"use client";

import { useEffect, useRef, useState } from "react";

export default function SpellOrb({ active }: { active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const [ready, setReady] = useState(false);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const element = host.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let clean = () => {};
    import("three").then(T => {
      if (disposed || !element) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      element.appendChild(renderer.domElement);

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(42, 1, .1, 30);
      camera.position.z = 5.7;
      scene.add(new T.AmbientLight(0xc3b5ff, 2.2));
      const warm = new T.PointLight(0xffa456, 38, 12);
      warm.position.set(2, 2, 4); scene.add(warm);
      const mint = new T.PointLight(0x8cffd8, 25, 10);
      mint.position.set(-2, -1, 2); scene.add(mint);

      const orbit = new T.Group(); scene.add(orbit);
      const coreGeometry = new T.IcosahedronGeometry(.72, 1);
      const coreMaterial = new T.MeshPhongMaterial({ color: 0x8c65b8, emissive: 0x2f1b59, specular: 0xf4d9ff, shininess: 22, flatShading: true });
      const core = new T.Mesh(coreGeometry, coreMaterial); orbit.add(core);
      const lineGeometry = new T.IcosahedronGeometry(.76, 1);
      const lineMaterial = new T.MeshBasicMaterial({ color: 0xb8ffdf, wireframe: true, transparent: true, opacity: .38 });
      const lines = new T.Mesh(lineGeometry, lineMaterial); orbit.add(lines);
      const ringGeometry = new T.TorusGeometry(1.18, .028, 5, 52);
      const ringMaterial = new T.MeshBasicMaterial({ color: 0xffbc73, transparent: true, opacity: .86 });
      const ring = new T.Mesh(ringGeometry, ringMaterial); ring.rotation.x = .55; orbit.add(ring);
      const outerGeometry = new T.TorusGeometry(1.47, .017, 4, 48);
      const outerMaterial = new T.MeshBasicMaterial({ color: 0xa3e6d0, transparent: true, opacity: .55 });
      const outer = new T.Mesh(outerGeometry, outerMaterial); outer.rotation.y = .6; orbit.add(outer);
      const shardGeometry = new T.OctahedronGeometry(.12, 0);
      const shardMaterial = new T.MeshPhongMaterial({ color: 0xffbc73, emissive: 0x7b3b0a, flatShading: true });
      const shards = Array.from({ length: 6 }, (_, i) => {
        const shard = new T.Mesh(shardGeometry, shardMaterial);
        const angle = i * Math.PI / 3;
        shard.position.set(Math.cos(angle) * 1.42, Math.sin(angle) * 1.1, i % 2 ? -.35 : .35);
        orbit.add(shard); return shard;
      });
      const resize = () => { const width = element.clientWidth || 180, height = element.clientHeight || 180; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
      const observer = new ResizeObserver(resize); observer.observe(element); resize();
      let pointerX = 0, pointerY = 0;
      const move = (event: PointerEvent) => { pointerX = (event.clientX / innerWidth - .5) * .34; pointerY = (event.clientY / innerHeight - .5) * .24; };
      window.addEventListener("pointermove", move, { passive: true });
      let frame = 0;
      const start = performance.now();
      function draw(now: number) {
        if (disposed) return;
        const time = (now - start) / 1000;
        const surge = activeRef.current ? 1 : 0;
        orbit.rotation.y += .006 + surge * .027;
        orbit.rotation.x += (pointerY - orbit.rotation.x) * .025;
        orbit.rotation.z += (pointerX - orbit.rotation.z) * .025;
        ring.rotation.z = time * (.28 + surge * 1.4);
        outer.rotation.z = -time * (.2 + surge * 1.1);
        orbit.position.y = Math.sin(time * 1.5) * .08;
        orbit.scale.setScalar(1 + surge * .14 + Math.sin(time * 2) * .015);
        shards.forEach((shard, i) => { shard.rotation.y = time + i; shard.rotation.x = time * .7; });
        if (!document.hidden) renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      }
      frame = requestAnimationFrame(draw);
      setReady(true);
      clean = () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("pointermove", move); renderer.dispose(); renderer.domElement.remove(); [coreGeometry, lineGeometry, ringGeometry, outerGeometry, shardGeometry].forEach(item => item.dispose()); [coreMaterial, lineMaterial, ringMaterial, outerMaterial, shardMaterial].forEach(item => item.dispose()); };
    }).catch(() => {});
    return () => { disposed = true; clean(); };
  }, []);

  return <div className={`spell-orb ${active ? "spell-orb-active" : ""}`} ref={host} aria-hidden="true"><span className={`spell-orb-fallback ${ready ? "hidden" : ""}`}>✦</span></div>;
}
