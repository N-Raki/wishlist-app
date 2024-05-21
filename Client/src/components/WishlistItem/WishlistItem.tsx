import {FC} from "react";
import {useQueries} from "@tanstack/react-query";
import {getUserDisplayName} from "../../services/user.service.ts";
import {Item} from "../../models/item.model.ts";
import {EnvelopeIcon, PhoneIcon} from "@heroicons/react/20/solid";
import {stringToColor} from "../../helpers/avatarHelper.ts";

interface WishlistItemProps {
    item: Item;
}

const WishlistItem: FC<WishlistItemProps> = ({ item }) => {

    const buyerQueries = useQueries({
        queries: item.buyerIds.map((userId) => {
            return {
                queryKey: ['buyer', userId],
                queryFn: () => getUserDisplayName(userId),
            };
        }),
    });
    
    return (
        <div key={item.id} className="flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
            <div className="flex flex-row">
                <div className="flex flex-1 flex-col p-3">
                    <h3 className="mt-6 text-sm font-medium text-gray-900">{item.name}</h3>
                    <dl className="mt-1 flex flex-grow flex-col justify-between">
                        <dt className="sr-only">Title</dt>
                        <dd className="text-sm text-gray-500">{item.price} €</dd>
                        <dt className="sr-only">Role</dt>
                        <dd className="mt-3">
                            {
                                item.url
                                    ? <a href={item.url} target="_blank"
                                         className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        Visit website
                                    </a>
                                    : null
                            }
                        </dd>
                    </dl>
                </div>
                <div className="flex flex-1 flex-col p-3 justify-center h-full">
                    <div className="grid-cols-2">
                        {
                            buyerQueries.map((buyerQuery, index) => {
                                if (buyerQuery.isSuccess) {
                                    const displayName: string = buyerQuery.data;
                                    return <div key={index} className="h-7 w-7 flex-shrink-0 rounded-full p-1" style={{backgroundColor: stringToColor(displayName)}}>
                                        <p>{displayName[0].toUpperCase()}</p>
                                    </div>
                                }
                                return null;
                            })
                        }
                    </div>
                </div>
            </div>
            <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                        <a
                            href={`mailto:${item.name}`}
                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                        >
                            <EnvelopeIcon className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"/>
                            Email
                        </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                        <a
                            href={`tel:${item.name}`}
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                        >
                            <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            Call
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WishlistItem;