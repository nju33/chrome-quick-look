import './style.css'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { render } from 'react-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { DEFAULT_VALUES } from './constants'
import { Options } from './interfaces'

const schema = yup.object().shape({
  width: yup.number().required(),
  height: yup.number().required(),
  inheritPreviousWindowSize: yup.boolean()
})

const Form = ({ options }: { options: Options }): React.ReactElement => {
  const { errors, handleSubmit, register, reset } = useForm<Options>({
    resolver: yupResolver(schema),
    defaultValues: options
  })

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>()
  const [message, setMessage] = React.useState<string | undefined>()

  return (
    <form
      className="space-y-2"
      onSubmit={handleSubmit((values) => {
        chrome.storage.local.set(values, () => {
          if (typeof chrome.runtime.lastError?.message === 'string') {
            setErrorMessage(chrome.runtime.lastError?.message)
            setTimeout(() => {
              setErrorMessage(undefined)
            }, 5000)
            return
          }

          setMessage(chrome.i18n.getMessage('saved'))
          setTimeout(() => {
            setMessage(undefined)
          }, 5000)
        })
      })}>
      <div>
        <h3 className="mb-2 font-bold">
          {chrome.i18n.getMessage('defaultWindowSize')}
        </h3>
        <div className="flex flex-col ml-2 space-y-2">
          <label className="space-x-1 flex items-center">
            <span className="flex-none w-16 text-right">
              {chrome.i18n.getMessage('height')}
              <span className="inline-block w-4 text-center">
                <i className="far fa-arrows-v"></i>
              </span>
            </span>
            <input
              ref={register}
              name="height"
              type="number"
              className="border rounded px-2 py-1"
              aria-invalid={errors.height !== undefined ? 'true' : 'false'}
            />
          </label>
          <label className="space-x-1 flex items-center">
            <span className="flex-none w-16 text-right">
              {chrome.i18n.getMessage('width')}
              <span className="inline-block w-4 text-center">
                <i className="far fa-arrows-h"></i>
              </span>
            </span>
            <input
              ref={register}
              name="width"
              type="number"
              className="border rounded px-2 py-1"
            />
          </label>
          {typeof errors.height?.message === 'string' && (
            <p className="text-red-500">{errors.height?.message}</p>
          )}
          {typeof errors.width?.message === 'string' && (
            <p className="text-red-500">{errors.width?.message}</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-bold">
          {chrome.i18n.getMessage('inheritPreviousWindowSize')}
        </h3>
        <label className="space-x-1 flex items-center ml-2">
          <span className="w-12"></span>
          <input
            ref={register}
            name="inheritPreviousWindowSize"
            type="checkbox"
            className="border rounded px-2 py-1"
          />
        </label>
      </div>
      <div className="flex">
        <span className="w-12"></span>
        <div className="flex justify-between w-full ml-2">
          <div className="">
            <button
              className="border border-gray-400 bg-gray-200 hover:bg-gray-400 duration-100 rounded py-1 px-2"
              onClick={() => reset()}>
              {chrome.i18n.getMessage('reset')}
            </button>
          </div>
          <div className="flex flex-col justify-start items-end">
            <button
              className="border border-green-400 bg-green-200 hover:bg-green-400 duration-100 rounded py-1 px-2"
              type="submit">
              <i className="far fa-plus mr-1"></i>
              {chrome.i18n.getMessage('add')}
            </button>
            <div>
              {typeof errorMessage === 'string' && (
                <span className="text-red-500">{errorMessage}</span>
              )}
              {typeof message === 'string' && (
                <span className="text-green-500">{message}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

const OptionsPage = (): React.ReactElement => {
  const [options, setOptions] = React.useState<Options | undefined>()
  chrome.storage.local.get(null, (options) => {
    setOptions({ ...DEFAULT_VALUES, ...options })
  })

  return (
    <div className="p-2">
      <h1 className="text-lg font-bold mb-2">Options</h1>
      {options !== undefined && <Form options={options} />}
      <div className="mt-2 text-xs flex justify-end space-x-1 opacity-50 hover:opacity-100 duration-100">
        <span>Created by</span>
        <img
          className="w-4 h-4"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABblBMVEUAAAA9MEI8L0ECAQIzKDcAAAAAAAAAAAAhGiQ1Kjo5LT46Lj87LkA7LkA+MEM8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0FENUoAAAA8L0E8L0EUEBY2Kjo8L0E7LkA7LkA+MUM7LkA8L0E6LkE6LkA5LkA7L0E9L0FlQUqYVlSaV1VrQ0s+MEFkQEmVVVSfWVaATE9LNkQ7LkFlQEredGPreWboeGV3SE1vRUzhdWTqeWbve2bBaF1ROEWXVlTxfGeHT1FnQkqoXVhiP0msX1jtemZ7Sk5SOEa4ZFtVOkahWlZmQUo4LUA9MEGnXFeUVFNKNURBMUJnQUpjQEnVcGHyfGfSb2GKUFFEMkNYO0fdc2PwfGdAMUJDMkJePkjddGPLbF9FM0OiWlbue2ZoQkpHNEOsX1m2Y1vneGW9Zlzcc2NCMkKcWFXNbV9pQktLNURWOkc/MEJXOkdgPkn///9LNMr8AAAAJnRSTlMAAAAAAAoFAQcvcrLf+AM3l9/7GorqNsP+QtnCAgI46Qgv3t73A6ZAUkQAAAABYktHRHmh3NTQAAAACXBIWXMAACxLAAAsSwGlPZapAAAAB3RJTUUH5QENFhUvwZjVcwAAAY5JREFUOMuFk2dXwjAUQEPYFGTvPWwixY2iojjAhRsRce+9UHH8fJMWhHIo3A/Nad89afIGUKoE1BqtjtEbWNagZ3Rajbr2WQlUgCLrMZrMFlTDYjYZe2R8QMULEFptdiTCbrNCWBcgdDhdqAWX00ENKkDo9mACQrgPx7l/xeMmBhHk0OFJ9A8MDg0nRkaTY+OphuGAciIorF48MTmVTk/PZGYzc/MLDcNrVRDBZ0M4m1tcWl5Zza+tZzc2GwKy+VTAHwgivJXf3ing3Vxxr1Dimk4aDPhByISosB9HuHxweHR80iwgUwiEI3UBcafJs/Oi6LKRMNBZGsLF5dX1zW3zFhYdYMiC7+4f4oh7fHouvryWRFswIEqF7FuZ5Knynkl/fKZEQhTE6FL9qpAn9/3zWxWdEaEYYOnCYeEV45Y4YgVBGlb4hTQx/pAdiPLX7ADDJ0oakiiaamlIqmmxpCHFouWWhJabNowktGFoy0nFhZajTds+Xmtavu3bxmtt331wuo9e2+HtrQ9vt/H/A8eEjgwvbvRXAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAxLTEzVDIyOjIxOjQ3KzAxOjAwrfUJ0wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMS0xM1QyMjoyMTo0NyswMTowMNyosW8AAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII="
        />{' '}
        <a
          href="https://github.com/nju33"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-yellow-500 duration-100">
          nju33
        </a>
      </div>
    </div>
  )
}

render(<OptionsPage />, document.getElementById('app'))
