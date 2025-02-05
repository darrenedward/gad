import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function UserCards() {
  const [cards, setCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [formValues, setFormValues] = useState({})

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    const { data, error } = await supabase.from('card_types').select('*')
    if (!error) setCards(data)
  }

  const handleCardSelect = (card) => {
    setSelectedCard(card)
    const initialValues = {}
    card.fields.forEach(field => {
      initialValues[field] = ''
    })
    setFormValues(initialValues)
  }

  const handleInputChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value })
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Cards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardSelect(card)}
            className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <h3 className="font-bold">{card.name}</h3>
            <p>Fields: {card.fields.join(', ')}</p>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Fill in {selectedCard.name}</h3>
          <div className="space-y-4">
            {selectedCard.fields.map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  value={formValues[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
