/**
 * 影人角色（ShadowRole）数据模型
 * 场次内的一个人物影偶，可指派操耍人、勾选需备影件。
 */

/** 生 / 旦 / 净 / 丑 / 神怪 */
export type RoleType = 'sheng' | 'dan' | 'jing' | 'chou' | 'shenguai';

/** 影人拆件部位 */
export type PropPart = 'toucha' | 'shenduan' | 'bingqi';

export interface ShadowRole {
  /** 主键，uuid */
  id: string;
  /** 所属场次 id */
  sceneId: string;
  /** 角色名，如「白娘子」 */
  name: string;
  /** 行当 */
  roleType: RoleType;
  /** 需备影件：头茬 / 身段 / 兵器 */
  propParts: PropPart[];
  /** 出场提示（手写）：仅作文字备注，不参与出场时刻计算 */
  entranceCue: string;
  /** 出场挂钩的本场锣鼓点 id；挂到鼓点上后出场时刻随鼓点秒点走，未挂钩为 null */
  entranceCueId: string | null;
  /** 出场待重排：原挂钩鼓点已撤，需重新挑一处挂回 */
  entrancePending: boolean;
  /** 唱白要点 */
  lineNote: string;
  /** 已指派的操耍人 id，未指派为 null */
  operatorId: string | null;
  /** 创建时间（ISO 字符串） */
  createdAt: string;
  /** 最近修改时间（ISO 字符串） */
  updatedAt: string;
}

/** 新建角色表单草稿 */
export type RoleDraft = Pick<
  ShadowRole,
  'name' | 'roleType' | 'propParts' | 'entranceCue' | 'lineNote'
>;

export const ROLE_TYPE_OPTIONS: ReadonlyArray<{ value: RoleType; label: string }> = [
  { value: 'sheng', label: '生' },
  { value: 'dan', label: '旦' },
  { value: 'jing', label: '净' },
  { value: 'chou', label: '丑' },
  { value: 'shenguai', label: '神怪' },
];

export const ROLE_TYPE_LABEL: Record<RoleType, string> = {
  sheng: '生',
  dan: '旦',
  jing: '净',
  chou: '丑',
  shenguai: '神怪',
};

export const ROLE_TYPE_COLOR: Record<RoleType, string> = {
  sheng: 'blue',
  dan: 'magenta',
  jing: 'volcano',
  chou: 'green',
  shenguai: 'purple',
};

export const PROP_PART_OPTIONS: ReadonlyArray<{ value: PropPart; label: string }> = [
  { value: 'toucha', label: '头茬' },
  { value: 'shenduan', label: '身段' },
  { value: 'bingqi', label: '兵器' },
];

export const PROP_PART_LABEL: Record<PropPart, string> = {
  toucha: '头茬',
  shenduan: '身段',
  bingqi: '兵器',
};

export function createEmptyRoleDraft(): RoleDraft {
  return {
    name: '',
    roleType: 'dan',
    propParts: ['toucha', 'shenduan'],
    entranceCue: '',
    lineNote: '',
  };
}

/** 出场挂钩状态：已挂钩锣鼓点 / 待重排（鼓点已撤） / 未挂钩（只留手写提示） */
export type EntranceLinkState = 'linked' | 'pending' | 'unlinked';

/**
 * 计算角色的出场挂钩状态。
 * - linked：挂着仍存在的本场鼓点，出场时刻随鼓点秒点走
 * - pending：挂过的鼓点已撤，需重新挑一处补齐
 * - unlinked：没有挂钩，只看手写提示
 */
export function entranceLinkState(role: Pick<ShadowRole, 'entranceCueId' | 'entrancePending'>): EntranceLinkState {
  if (role.entrancePending) return 'pending';
  return role.entranceCueId ? 'linked' : 'unlinked';
}

export const ENTRANCE_LINK_LABEL: Record<EntranceLinkState, string> = {
  linked: '已挂钩',
  pending: '出场待重排',
  unlinked: '未挂钩',
};
