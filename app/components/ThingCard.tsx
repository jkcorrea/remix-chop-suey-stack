import { Link } from '@remix-run/react'
import type { SerializeFrom } from '@remix-run/server-runtime'
import { BsPlusLg, BsTrashFill } from 'react-icons/bs'

import { classNames } from '~/lib/utils'
import type { ThingDTO } from '~/resources/thing.server'

type CreateProps = Record<string, never>
type ThingProps = {
  thing: SerializeFrom<ThingDTO>
  onDelete: () => void
}

type Props = CreateProps | ThingProps

const ThingCard = (props: Props) => {
  const { thing = undefined, onDelete = undefined } =
    'thing' in props ? props : {}

  return (
    <div
      className={classNames(
        'card card-compact relative h-16 w-16 md:h-32 md:w-32',
        !thing
          ? 'bg-transparent'
          : 'border border-base-content bg-base-300 shadow transition-all duration-200 '
      )}
    >
      <Link
        to={`/things/${thing ? thing.id : 'new'}`}
        className="flex h-full w-full items-center"
      >
        <div className="card-body relative items-center justify-center">
          <div className="card-title text-sm">
            {thing ? (
              thing.name
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <BsPlusLg className="text-xl" />
                <span>Create Thing</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {thing && (
        <div className="card-actions absolute top-1 right-1 z-10">
          <button
            className="btn-ghost btn-square btn-sm btn p-0"
            aria-label="delete thing"
            onClick={onDelete}
            data-test="delete-thing"
          >
            <BsTrashFill />
          </button>
        </div>
      )}
    </div>
  )
}

export default ThingCard
