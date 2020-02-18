let count = 1
try {
  if (sessionStorage.count) { count = sessionStorage.count }
} catch (e) {}
export default {
  count: count
}
