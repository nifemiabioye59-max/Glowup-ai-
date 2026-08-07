import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function analyzeOutfit(imageBase64: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are GLOWUP.AI, a professional stylist for African fashion and beauty.' },
      { role: 'user', content: [
        { type: 'text', text: 'Analyze this outfit. Return JSON: {styling_tips:[], occasion_suggestions:[], color_analysis:"", similar_items:[{category:"",description:"",estimated_price_ngn:number}], confidence_score:number}' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]}
    ],
    max_tokens: 1000, response_format: { type: 'json_object' }
  })
  return JSON.parse(res.choices[0].message.content || '{}')
}

export async function analyzeSkin(imageBase64: string, concerns?: string[]) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are GLOWUP.AI, a skincare expert for melanin-rich skin. Consider Nigerian climate.' },
      { role: 'user', content: [
        { type: 'text', text: `Analyze this skin. Concerns: ${concerns?.join(', ') || 'none'}. Return JSON: {skin_type:"",skin_tone:"",concerns:[],recommendations:{morning_routine:[],evening_routine:[]},product_suggestions:[{category:"",type:"",estimated_price_ngn:number}],professional_advice:""}` },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]}
    ],
    max_tokens: 1200, response_format: { type: 'json_object' }
  })
  return JSON.parse(res.choices[0].message.content || '{}')
}

export async function recommendHair(imageBase64: string, budget: number) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are GLOWUP.AI, a hair specialist for African hair textures. Consider Nigerian salons and wig markets.' },
      { role: 'user', content: [
        { type: 'text', text: `Recommend hairstyles for this face shape. Budget: ₦${budget}. Return JSON: {face_shape:"",face_shape_description:"",recommended_styles:[{style_name:"",description:"",why_it_works:"",maintenance_level:"",estimated_cost_ngn:number,where_to_get:""}],styles_to_avoid:[],budget_optimization:""}` },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]}
    ],
    max_tokens: 1200, response_format: { type: 'json_object' }
  })
  return JSON.parse(res.choices[0].message.content || '{}')
}

export async function analyzeFood(imageBase64: string) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are GLOWUP.AI nutritionist for African diets. Be practical and budget-aware.' },
      { role: 'user', content: [
        { type: 'text', text: 'Analyze this food/meal. Return JSON: {food_name:"",calories:number,macros:{protein:"",carbs:"",fat:""},health_rating:"good|moderate|limit",healthier_swap:"",tips:""}' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]}
    ],
    max_tokens: 800, response_format: { type: 'json_object' }
  })
  return JSON.parse(res.choices[0].message.content || '{}')
}
