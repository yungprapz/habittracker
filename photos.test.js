import {test} from 'node:test';import assert from 'node:assert/strict';import {photoWeek,fitSize,weeksApart} from './photos.js';
test('scalp photos: one per Monday–Sunday week, downscaled, weeks apart',()=>{assert.equal(photoWeek('2026-11-16'),'2026-11-16');assert.equal(photoWeek('2026-11-22'),'2026-11-16');assert.equal(photoWeek('2026-11-23'),'2026-11-23');
  assert.deepEqual(fitSize(4032,3024),{w:1600,h:1200});assert.deepEqual(fitSize(3024,4032),{w:1200,h:1600});assert.deepEqual(fitSize(800,600),{w:800,h:600});
  assert.equal(weeksApart('2026-11-16','2026-12-28'),6);assert.equal(weeksApart('2026-03-23','2026-03-30'),1)});
