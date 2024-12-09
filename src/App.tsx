import { useState } from 'react';
import './App.css';

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
  handleModelChange: (id: number, value: string) => void;
  addNewParam: (name: string, type?: 'string', value?: string) => void;
  deleteParam: (id: number) => void;
}

const DEFAULT_PARAMS: Param[] = [
  {
    id: 1,
    name: 'Назначение',
    type: 'string',
  },
  {
    id: 2,
    name: 'Длина',
    type: 'string',
  },
];

const DEFAULT_MODEL: Model = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное',
    },
    {
      paramId: 2,
      value: 'макси',
    },
  ],
};

export default function App() {
  const [model, setModel] = useState<Model>(DEFAULT_MODEL);
  const [params, setParams] = useState<Param[]>(DEFAULT_PARAMS);

  const handleModelChange: Props['handleModelChange'] = (paramId, value) => {
    setModel(prev => ({
      ...prev,
      paramValues: prev.paramValues.map(param =>
        param.paramId === paramId ? { ...param, value } : param
      ),
    }));
  };

  const addNewParam: Props['addNewParam'] = (
    name: string,
    type: 'string' = 'string',
    value: string = ''
  ) => {
    const newParamId = Date.now();

    if (!params.some(param => param.name === name)) {
      setParams(prev => [...prev, { id: newParamId, name, type }]);
      setModel(prev => ({
        ...prev,
        paramValues: [...prev.paramValues, { paramId: newParamId, value }],
      }));
    }
  };

  const deleteParam = (id: number) => {
    setParams(prev => prev.filter(param => param.id !== id));
    setModel(prev => ({
      ...prev,
      paramValues: prev.paramValues.filter(param => param.paramId !== id),
    }));
  };

  return (
    <ParamEditor
      params={params}
      model={model}
      handleModelChange={handleModelChange}
      addNewParam={addNewParam}
      deleteParam={deleteParam}
    />
  );
}

function ParamEditor({
  params,
  model,
  handleModelChange,
  addNewParam: addParam,
  deleteParam,
}: Props) {
  const normParamValues = model.paramValues.reduce<{
    [key: ParamValue['paramId']]: ParamValue['value'];
  }>(
    (acc, { paramId, value }) => ({
      ...acc,
      [paramId]: value,
    }),
    {}
  );

  const [isNewParamFormOpen, setIsNewParamFormOpen] = useState<boolean>(false);
  const [newParamName, setNewParamName] = useState<string>('');

  //@ts-expect-error
  const getModel = (): Model => {
    return model;
  };

  return (
    <div className="param-editor">
      <form className="param-list">
        {params.map(param => (
          <div className="param-field" key={param.id}>
            <label htmlFor={`param-${param.id}`}>{param.name}</label>
            <input
              id={`param-${param.id}`}
              type="text"
              placeholder="Введите значение"
              value={normParamValues[param.id]}
              onChange={e => handleModelChange(param.id, e.target.value)}
            />
            <button
              onClick={() => deleteParam(param.id)}
              className="delete-param-button"
            >
              Удалить
            </button>
          </div>
        ))}
      </form>
      {!isNewParamFormOpen && (
        <button onClick={() => setIsNewParamFormOpen(prev => !prev)}>
          Добавить параметр
        </button>
      )}
      {isNewParamFormOpen && (
        <form
          className="param-editor"
          onSubmit={e => {
            e.preventDefault();
            addParam(newParamName);
            setIsNewParamFormOpen(false);
            setNewParamName('');
          }}
        >
          <div className="new-param-field">
            <label htmlFor="new-param-name">Название</label>
            <input
              id="new-param-name"
              type="text"
              placeholder="Введите значение"
              required
              value={newParamName}
              onChange={e => setNewParamName(e.target.value)}
            />
            <div className="new-param-field__controls">
              <button type="submit">Ок</button>
              <button
                type="button"
                onClick={() => setIsNewParamFormOpen(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
