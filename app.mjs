import { readFileSync } from 'node:fs'

function analyze({width,minimumGap,items}) {
  if (![width,minimumGap].every(Number.isFinite) || width <= 0 || minimumGap < 0 ||
      !Array.isArray(items) || !items.length || items.some(item=>!item.name?.trim() || !Number.isFinite(item.width) || item.width <= 0)) {
    throw new Error('Invalid shelf size, gap, or item')
  }
  const used = items.reduce((total,item)=>total+item.width,0)
  const gap = (width-used)/(items.length+1)
  if (gap < minimumGap) return {fits:false,extraWidth:Number((used+minimumGap*(items.length+1)-width).toFixed(4)),positions:[]}
  let offset = gap
  const positions = items.map(item=>{
    const start = offset
    offset += item.width+gap
    return Number(start.toFixed(4))
  })
  return {fits:true,gap:Number(gap.toFixed(4)),positions}
}

try {
  if (process.argv.length !== 3) throw new Error('Usage: node app.mjs input.json')
  console.log(JSON.stringify(analyze(JSON.parse(readFileSync(process.argv[2], 'utf8')))))
} catch (error) {
  console.error(error.message)
  process.exitCode = 2
}
