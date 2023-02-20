export default function (context) {
  const { $cookies, $pinia } = context
  console.log('Has $pinia?', !!$pinia)
}
