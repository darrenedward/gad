import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export default function AdminPanel() {
  const [cardTypes, setCardTypes] = useState([])
  const [newCardType, setNewCardType] = useState({
    name: '',
    fields: [],
    image_url: '',
    field_positions: {}
  })
  const [newField, setNewField] = useState({ label: '', type: 'text', validation: '' })

  useEffect(() => {
    fetchCardTypes()
  }, [])

  const fetchCardTypes = async () => {
    const { data, error } = await supabase.from('card_types').select('*')
    if (!error) setCardTypes(data)
  }

  const handleAddField = () => {
    setNewCardType({
      ...newCardType,
      fields: [...newCardType.fields, newField.label],
      field_positions: {
        ...newCardType.field_positions,
        [newField.label]: { x: 0, y: 0 }
      }
    })
    setNewField({ label: '', type: 'text', validation: '' })
  }

  const handleAddCardType = async () => {
    const { data, error } = await supabase
      .from('card_types')
      .insert([newCardType])
      .select()
    
    if (!error) {
      setCardTypes([...cardTypes, data[0]])
      setNewCardType({
        name: '',
        fields: [],
        image_url: '',
        field_positions: {}
      })
    }
  }

  const handleFieldChange = (field, value) => {
    setNewField({ ...newField, [field]: value })
  }

  const handleFieldPositionChange = (cardId, field, x, y) => {
    setCardTypes(cardTypes.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          field_positions: {
            ...card.field_positions,
            [field]: { x, y }
          }
        }
      }
      return card
    }))
  }

  const handleImageUpload = async (event, cardId) => {
    const file = event.target.files[0]
    if (!file) return

    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(`${uuidv4()}-${file.name}`, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      const { data: imageData, error: imageError } = await supabase.storage
        .from('card-images')
        .getPublicUrl(data.path)

      if (imageError) {
        console.error(imageError)
        alert(imageError.message)
      } else {
        setCardTypes(cardTypes.map(card => {
          if (card.id === cardId) {
            return {
              ...card,
              image_url: imageData.publicUrl
            }
          }
          return card
        }))
      }
    }
  }

  const handleEditCardType = async (cardId, updatedCardType) => {
    const { data, error } = await supabase
      .from('card_types')
      .update(updatedCardType)
      .eq('id', cardId)
      .select()
    
    if (!error) {
      setCardTypes(cardTypes.map(card => (card.id === cardId ? data[0] : card)))
    }
  }

  const handleDeleteCardType = async (cardId) => {
    const { error } = await supabase
      .from('card_types')
      .delete()
      .eq('id', cardId)
    
    if (!error) {
      setCardTypes(cardTypes.filter(card => card.id !== cardId))
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Manage Card Types</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add New Card Type</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Card Type Name"
            value={newCardType.name}
            onChange={(e) => setNewCardType({ ...newCardType, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Field Label"
              value={newField.label}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              value={newField.type}
              onChange={(e) => handleFieldChange('type', e.target.value)}
              className="p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="date">Date</option>
              <option value="number">Number</option>
            </select>
            <input
              type="text"
              placeholder="Validation Rules"
              value={newField.validation}
              onChange={(e) => handleFieldChange('validation', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button 
              onClick={handleAddField}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Field
            </button>
          </div>
          <div className="space-y-2">
            {newCardType.fields.map((field, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{field}</span>
                <input
                  type="number"
                  placeholder="X"
                  value={newCardType.field_positions[field]?.x || 0}
                  onChange={(e) => handleFieldPositionChange(newCardType.id, field, parseInt(e.target.value), newCardType.field_positions[field]?.y || 0)}
                  className="w-16 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Y"
                  value={newCardType.field_positions[field]?.y || 0}
                  onChange={(e) => handleFieldPositionChange(newCardType.id, field, newCardType.field_positions[field]?.x || 0, parseInt(e.target.value))}
                  className="w-16 p-2 border rounded"
                />
              </div>
            ))}
          </div>
          <input
            type="file"
            onChange={(e) => handleImageUpload(e, newCardType.id)}
            className="mt-4"
          />
          <button 
            onClick={handleAddCardType}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Card Type
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Card Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardTypes.map((cardType) => (
            <div key={cardType.id} className="border p-4 rounded-lg">
              <h4 className="font-bold">{cardType.name}</h4>
              <p>Fields: {cardType.fields.join(', ')}</p>
              {cardType.image_url && (
                <div className="relative mt-2">
                  <img 
                    src={cardType.image_url} 
                    alt={cardType.name} 
                    className="max-w-full h-auto"
                  />
                  {cardType.fields.map((field, index) => (
                    <div 
                      key={index} 
                      className="absolute bg-gray-500 text-white px-2 py-1 rounded"
                      style={{
                        left: `${cardType.field_positions[field]?.x || 0}px`,
                        top: `${cardType.field_positions[field]?.y || 0}px`
                      }}
                    >
                      {field}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                {cardType.fields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{field}</span>
                    <input
                      type="number"
                      placeholder="X"
                      value={cardType.field_positions[field]?.x || 0}
                      onChange={(e) => handleFieldPositionChange(cardType.id, field, parseInt(e.target.value), cardType.field_positions[field]?.y || 0)}
                      className="w-16 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Y"
                      value={cardType.field_positions[field]?.y || 0}
                      onChange={(e) => handleFieldPositionChange(cardType.id, field, cardType.field_positions[field]?.x || 0, parseInt(e.target.value))}
                      className="w-16 p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleDeleteCardType(cardType.id)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
