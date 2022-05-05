import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export type $ProfileλShape = $.typeutil.flatten<_std.$Object_f1e1d4a0bda611eca08599c7be50f4a1λShape & {
  "alias": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "userId": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, true, false, false, false>;
  "<owner[is Thing]": $.LinkDesc<$Thing, $.Cardinality.Many, {}, false, false,  false, false>;
  "<owner": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Profile = $.ObjectType<"default::Profile", $ProfileλShape, null>;
const $Profile = $.makeType<$Profile>(_.spec, "c56631d6-c8e7-11ec-9dd4-2bcac429befa", _.syntax.literal);

const Profile: $.$expr_PathNode<$.TypeSet<$Profile, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Profile, $.Cardinality.Many), null, true);

export type $ThingλShape = $.typeutil.flatten<_std.$Object_f1e1d4a0bda611eca08599c7be50f4a1λShape & {
  "owner": $.LinkDesc<$Profile, $.Cardinality.One, {}, false, false,  false, false>;
  "description": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $Thing = $.ObjectType<"default::Thing", $ThingλShape, null>;
const $Thing = $.makeType<$Thing>(_.spec, "c56d77e8-c8e7-11ec-86c5-2b8be6d389ff", _.syntax.literal);

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
