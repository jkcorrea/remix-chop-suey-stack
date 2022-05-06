import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export type $ProfileλShape = $.typeutil.flatten<_std.$Object_f1e1d4a0bda611eca08599c7be50f4a1λShape & {
  "alias": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "userId": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<owner[is Thing]": $.LinkDesc<$Thing, $.Cardinality.Many, {}, false, false,  false, false>;
  "<owner": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Profile = $.ObjectType<"default::Profile", $ProfileλShape, null>;
const $Profile = $.makeType<$Profile>(_.spec, "8e69d382-cc9c-11ec-a60f-e12a339d48a6", _.syntax.literal);

const Profile: $.$expr_PathNode<$.TypeSet<$Profile, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Profile, $.Cardinality.Many), null, true);

export type $ThingλShape = $.typeutil.flatten<_std.$Object_f1e1d4a0bda611eca08599c7be50f4a1λShape & {
  "owner": $.LinkDesc<$Profile, $.Cardinality.One, {}, false, false,  false, false>;
  "description": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $Thing = $.ObjectType<"default::Thing", $ThingλShape, null>;
const $Thing = $.makeType<$Thing>(_.spec, "8e6ea0b0-cc9c-11ec-8fbc-abde3e0e6b4e", _.syntax.literal);

const Thing: $.$expr_PathNode<$.TypeSet<$Thing, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Thing, $.Cardinality.Many), null, true);



export { $Profile, Profile, $Thing, Thing };

type __defaultExports = {
  "Profile": typeof Profile;
  "Thing": typeof Thing
};
const __defaultExports: __defaultExports = {
  "Profile": Profile,
  "Thing": Thing
};
export default __defaultExports;
