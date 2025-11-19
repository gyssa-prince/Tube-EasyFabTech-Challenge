import * as THREE from "three";

export default function Tube({ width = 1, height = 1, thickness = 0.08, length = 4, wireframe = false, color = 0x3B5BA9 }) {
  const g = new THREE.Group();

  // clamp thickness not larger than dims
  const t = Math.min(thickness, Math.min(width, height) / 2 - 0.001);

  const mat = new THREE.MeshStandardMaterial({ color, wireframe });

  // left wall (x negative)
  const leftGeo = new THREE.BoxGeometry(t, height, length);
  const left = new THREE.Mesh(leftGeo, mat);
  left.position.set(-(width / 2) + t / 2, 0, 0);
  g.add(left);

  // right wall (x positive)
  const right = new THREE.Mesh(leftGeo.clone(), mat);
  right.position.set((width / 2) - t / 2, 0, 0);
  g.add(right);

  // top wall (y positive)
  const topGeo = new THREE.BoxGeometry(width - t * 2, t, length);
  const top = new THREE.Mesh(topGeo, mat);
  top.position.set(0, (height / 2) - t / 2, 0);
  g.add(top);

  // bottom wall (y negative)
  const bottom = new THREE.Mesh(topGeo.clone(), mat);
  bottom.position.set(0, -(height / 2) + t / 2, 0);
  g.add(bottom);

  // useful bounding helper
  g.userData.dims = { width, height, length, thickness: t };

  return g;
}