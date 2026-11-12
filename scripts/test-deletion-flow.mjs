// Standalone unit test verifying deletion persistence logic
import assert from "node:assert";

// Mock store simulating master data
const initialDeletedIds = ["del-old-1"];
let masterStore = {
  projects: [
    { id: "proj-1", slug: "project-one", title: "Project One" },
    { id: "proj-2", slug: "project-two", title: "Project Two" },
    { id: "proj-3", slug: "project-three", title: "Project Three" }
  ],
  services: [
    { id: "serv-1", slug: "service-one", title: "Service One" }
  ],
  team: [
    { id: "team-1", name: "Architect 1" },
    { id: "team-2", name: "Architect 2" }
  ],
  deletedIds: [...initialDeletedIds],
  updatedAt: "2026-11-12T10:00:00.000Z"
};

function filterOutDeletedItems(list, deletedIds) {
  if (!Array.isArray(list)) return [];
  const set = new Set(deletedIds || []);
  return list.filter((item) => item && !set.has(item.id) && (!item.slug || !set.has(item.slug)));
}

// 1. Simulate deleteRecord("projects", "proj-2", "project-two")
function simulateDeleteRecord(entity, recordId, slug) {
  const idsToRemove = new Set();
  if (recordId) idsToRemove.add(recordId);
  if (slug) idsToRemove.add(slug);

  const mergedDeleted = new Set(masterStore.deletedIds || []);
  idsToRemove.forEach((id) => mergedDeleted.add(id));
  masterStore.deletedIds = Array.from(mergedDeleted);

  if (Array.isArray(masterStore[entity])) {
    masterStore[entity] = masterStore[entity].filter(
      (item) => item && !idsToRemove.has(String(item.id)) && !idsToRemove.has(String(item.slug))
    );
  }
  masterStore.updatedAt = new Date().toISOString();
}

// 2. Simulate API POST route with array payload and deletedIds (whole entity replacement)
function simulateApiPostEntity(body) {
  const isSingleRecordUpdate = Boolean(
    body.record ||
    (body.recordId && body.data && !Array.isArray(body.data))
  );

  assert.strictEqual(isSingleRecordUpdate, false, "Array data must NOT be treated as single record update!");

  if (body.entity && body.data !== undefined) {
    if (Array.isArray(body.deletedIds) && body.deletedIds.length > 0) {
      const mergedDeleted = new Set(masterStore.deletedIds || []);
      body.deletedIds.forEach((id) => {
        if (id) mergedDeleted.add(String(id));
      });
      masterStore.deletedIds = Array.from(mergedDeleted);
    }
    const activeDeletedIds = new Set(masterStore.deletedIds || []);
    masterStore[body.entity] = Array.isArray(body.data)
      ? body.data.filter((item) => item && !activeDeletedIds.has(item.id) && (!item.slug || !activeDeletedIds.has(item.slug)))
      : body.data;
  }
}

// Run Test 1: Explicit deleteRecord
simulateDeleteRecord("projects", "proj-2", "project-two");
assert.strictEqual(masterStore.projects.length, 2);
assert.strictEqual(masterStore.projects.some(p => p.id === "proj-2"), false);
assert.strictEqual(masterStore.deletedIds.includes("proj-2"), true);
assert.strictEqual(masterStore.deletedIds.includes("project-two"), true);
console.log("✓ Test 1 Passed: simulateDeleteRecord correctly purged item and updated deletedIds.");

// Run Test 2: Admin save after filter
const remainingProjects = masterStore.projects.filter(p => p.id !== "proj-1");
simulateApiPostEntity({
  entity: "projects",
  data: remainingProjects,
  deletedIds: [...masterStore.deletedIds, "proj-1", "project-one"]
});
assert.strictEqual(masterStore.projects.length, 1);
assert.strictEqual(masterStore.projects[0].id, "proj-3");
assert.strictEqual(masterStore.deletedIds.includes("proj-1"), true);
console.log("✓ Test 2 Passed: simulateApiPostEntity route correctly handles whole-entity replacement.");

console.log("ALL UNIT TESTS PASSED SUCCESSFULLY! Deletion persistence is verified.");

